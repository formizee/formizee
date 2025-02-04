import type {submissions as submissionsApi} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {ParamsSchema} from './schema';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Submissions'],
  summary: 'Delete a submission',
  path: '/{endpointId}/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Delete a submission',
      content: {
        'application/json': {
          schema: z.object({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerDeleteSubmission = (api: typeof submissionsApi) => {
  return api.openapi(deleteRoute, async context => {
    const workspaceId = context.get('workspace').id;
    const {database, vault, analytics, logger} = context.get('services');
    const input = context.req.valid('param');

    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.endpointId)
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

    const {error} = await vault.submissions.delete(input);

    if (error) {
      logger.error(`vault.submissions.delete(${input.id})`, {error});
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    return context.json({}, 200);
  });
};
