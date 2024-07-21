import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute, z} from '@hono/zod-openapi';
import {and, db, eq, schema} from '@formizee/db';
import {ParamsSchema} from './schema';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Endpoints'],
  description: 'Delete a endpoint',
  path: '/{id}',
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
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');

    const endpoint = await db.query.endpoint.findFirst({
      where: and(
        eq(schema.endpoint.workspaceId, workspace.id),
        eq(schema.endpoint.id, id)
      )
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found.'
      });
    }

    await db.delete(schema.endpoint).where(eq(schema.endpoint.id, id));

    return context.json({}, 200);
  });
};
