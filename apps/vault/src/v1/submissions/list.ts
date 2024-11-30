import {ListParams, SubmissionSchema} from './schema';
import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {aes} from '@formizee/encryption';
import {assignOriginDatabase} from '@/lib/databases';
import {
  MetadataSchema,
  QuerySchema,
  calculateTotalPages
} from '@/lib/pagination';
import {count, eq, schema} from '@formizee/db/submissions';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'List endpoint submissions',
  path: '/{endpointId}',
  request: {
    query: QuerySchema,
    params: ListParams
  },
  responses: {
    200: {
      description: 'List endpoint submissions',
      content: {
        'application/json': {
          schema: z.object({
            _metadata: MetadataSchema.merge(
              z.object({
                schema: z.custom<Record<string, string>>()
              })
            ),
            submissions: SubmissionSchema.array()
          })
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListSubmissions = (api: typeof submissionsAPI) => {
  return api.openapi(listRoute, async context => {
    const {metrics, logger, database, storage, cache, keys} =
      context.get('services');
    const {page, limit} = context.get('pagination');
    const input = context.req.valid('param');
    const queryStart = performance.now();

    const originDatabase = await assignOriginDatabase(
      {database, cache},
      input.endpointId
    );

    if (!originDatabase) {
      throw new HTTPException(404, {
        message:
          'Origin database not found, please contact support@formizee.com'
      });
    }

    const endpoint = await originDatabase.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, input.endpointId)
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    // Query submissions
    let submissions = await cache.getSubmissions({
      endpointId: input.endpointId,
      pageSize: limit,
      page
    });
    if (!submissions) {
      const [data, totalItems] = await Promise.all([
        originDatabase.query.submission.findMany({
          where: (table, {eq}) => eq(table.endpointId, input.endpointId),
          offset: (page - 1) * limit,
          limit
        }),
        originDatabase
          .select({count: count()})
          .from(schema.submission)
          .where(eq(schema.submission.endpointId, input.endpointId))
      ]);

      if (!data || !totalItems[0]) {
        submissions = {
          totalItems: 0,
          data: []
        };
      } else {
        submissions = {
          totalItems: totalItems[0].count,
          data
        };
      }
    }

    const [key] = await Promise.all([
      keys.getEndpointDEK(context.env, input.endpointId),
      cache.storeSubmissions(
        {
          endpointId: input.endpointId,
          page,
          pageSize: limit,
          totalItems: submissions.totalItems
        },
        submissions.data
      )
    ]);

    const response = await Promise.all(
      submissions.data.map(async submission => {
        const decryptedSubmission = await aes.decrypt(
          {iv: submission.iv, cipherText: submission.cipherText},
          key
        );
        const fileUploads = await storage.getDownloadLinks(
          originDatabase,
          submission.id
        );

        const submissionData = JSON.parse(decryptedSubmission);

        // Merge file uploads with the data
        const data = (fileUploads || []).reduce(
          (acc, file) => {
            if (file && Object.keys(file).length > 0) {
              for (const [key, value] of Object.entries(file)) {
                acc[key] = value;
              }
            }
            return acc;
          },
          {...submissionData}
        );

        const response = {
          id: submission.id,
          endpointId: submission.endpointId,
          data,
          isSpam: submission.isSpam,
          isRead: submission.isRead,
          location: submission.location,
          createdAt: submission.createdAt
        };

        return response;
      })
    );

    try {
      const totalPages = calculateTotalPages(
        page,
        submissions.totalItems,
        limit
      );
      const endpointSchema = JSON.parse(endpoint.schema);

      metrics.emit({
        metric: 'vault.latency',
        query: 'submissions.list',
        latency: performance.now() - queryStart
      });

      return context.json(
        {
          _metadata: {
            page,
            totalPages,
            itemsPerPage: limit,
            schema: endpointSchema
          },
          submissions: response
        },
        200
      );
    } catch (error) {
      logger.error('Unexpected error listing submissions', {error});
      throw error;
    }
  });
};
