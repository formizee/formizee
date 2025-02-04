import {SubmissionSchema, ParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Submissions'],
  summary: 'Update a submission',
  path: '/{endpointId}/{id}',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: SubmissionSchema.pick({isRead: true, isSpam: true}).partial()
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Update a submission',
      content: {
        'application/json': {
          schema: SubmissionSchema.omit({data: true})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPutSubmission = (api: typeof submissionsApi) => {
  return api.openapi(putRoute, async context => {
    const {database, vault, analytics, logger} = context.get('services');
    const workspaceId = context.get('workspace').id;
    const params = context.req.valid('param');
    const input = context.req.valid('json');

    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, params.endpointId)
      })
      .finally(() => {
        analytics.metrics.insertDatabase({
          type: 'read',
          query: 'endpoints.get',
          latency: performance.now() - queryStart
        });
      });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    if (endpoint.workspaceId !== workspaceId) {
      throw new HTTPException(401, {
        message: 'This submission belongs to another workspace'
      });
    }

    const {data, error} = await vault.submissions.put({...params, ...input});
    if (error) {
      logger.error(`vault.submissions.put(${params.id})`, {error});
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    const response = SubmissionSchema.omit({data: true}).parse(data);
    return context.json(response, 200);
  });
};
