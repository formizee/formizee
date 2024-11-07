import {deleteSchema, deleteSubmission} from '@/lib/helpers';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute, z} from '@hono/zod-openapi';
import type {endpoints as endpointsAPI} from '.';
import {ParamsSchema} from './schema';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Submissions'],
  summary: 'Delete a endpoint',
  path: '/{endpointId}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Delete a endpoint',
      content: {
        'application/json': {
          schema: z.object({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerDeleteEndpoint = (api: typeof endpointsAPI) => {
  return api.openapi(deleteRoute, async context => {
    const {endpointId} = context.req.valid('param');
    const bucket = context.env.BUCKET;
    const vault = context.env.VAULT;

    await deleteSchema(endpointId, bucket);

    const list = await vault.list({prefix: `${endpointId}:`});

    if (list.keys.length < 1) {
      return context.json({}, 200);
    }

    await Promise.all(
      list.keys.map(async key => {
        return await deleteSubmission(key.name, vault);
      })
    );

    return context.json({}, 200);
  });
};
