import type {submissions as submissionsAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
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

export const registerDeleteSubmission = (api: typeof submissionsAPI) => {
  return api.openapi(deleteRoute, async context => {
    const {endpointId, id} = context.req.valid('param');

    await context.env.VAULT.delete(`${endpointId}:${id}`);

    return context.json({}, 200);
  });
};
