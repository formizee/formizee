import {SubmissionSchema, EndpointParamsSchema} from './schema';
import {MetadataSchema, QuerySchema} from '@/lib/pagination';
import type {listSubmissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'List endpoint submissions',
  path: '/{endpointId}',
  request: {
    params: EndpointParamsSchema,
    query: QuerySchema
  },
  responses: {
    200: {
      description: 'List endpoint submission',
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

export const registerListSubmissions = (api: typeof submissionsApi) => {
  return api.openapi(listRoute, async context => {
    const {database, metrics, vault, logger} = context.get('services');
    const {page, limit} = context.get('pagination');
    const workspace = context.get('workspace');
    const {endpointId} = context.req.valid('param');

    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {and, eq}) =>
          and(eq(table.workspaceId, workspace.id), eq(table.id, endpointId))
      })
      .finally(() => {
        metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryStart
        });
      });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    const {data, error} = await vault.submissions.list({
      endpointId,
      page,
      limit
    });
    if (error) {
      logger.error(`vault.submissions.list(${endpointId})`, {error});
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    const submissions = data.submissions.map(submission =>
      SubmissionSchema.parse(submission)
    );

    return context.json({...data, submissions}, 200);
  });
};
