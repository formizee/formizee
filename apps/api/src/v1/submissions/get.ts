import {SubmissionSchema, ParamsSchema} from './schema';
import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';

export const getRoute = createRoute({
  method: 'get',
  tags: ['Submissions'],
  summary: 'Retrieve a submission',
  path: '/{endpointId}/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Retrieve a submission',
      content: {
        'application/json': {
          schema: SubmissionSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerGetSubmission = (api: typeof submissionsApi) => {
  return api.openapi(getRoute, async context => {
    const {database, metrics, vault, logger} = context.get('services');
    const workspaceId = context.get('workspace').id;
    const input = context.req.valid('param');

    const {data, error} = await vault.submissions.get(input);

    if (error) {
      logger.error(`vault.submissions.get(${input.id})`, {error});
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.endpointId)
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

    if (endpoint.workspaceId !== workspaceId) {
      throw new HTTPException(401, {
        message: 'This submission belongs to another workspace'
      });
    }

    const response = SubmissionSchema.parse(data);

    return context.json(response, 200);
  });
};
