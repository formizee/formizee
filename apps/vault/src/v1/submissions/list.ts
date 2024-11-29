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
            _metadata: MetadataSchema,
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
    const {database, storage, cache, keys} = context.get('services');
    const {page, limit} = context.get('pagination');
    const input = context.req.valid('param');

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

    const totalPages = calculateTotalPages(page, submissions.totalItems, limit);

    return context.json(
      {
        _metadata: {
          page,
          totalPages,
          itemsPerPage: limit
        },
        submissions: response
      },
      200
    );
  });
};
