import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute, z} from '@hono/zod-openapi';
import {and, eq, schema} from '@formizee/db';
import {ParamsSchema} from './schema';
import {deleteEndpoint} from '@/lib/vault';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Endpoints'],
  summary: 'Delete a endpoint',
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
    const {analytics, database} = context.get('services');
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');
    const rootKey = context.get('key');

    const endpoint = await database.query.endpoint.findFirst({
      where: and(
        eq(schema.endpoint.workspaceId, workspace.id),
        eq(schema.endpoint.id, id)
      )
    });

    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    await database.delete(schema.endpoint).where(eq(schema.endpoint.id, id));
    await deleteEndpoint(context.env.VAULT, context.env.VAULT_SECRET, id);

    await analytics.ingestFormizeeAuditLogs({
      event: 'endpoint.delete',
      workspaceId: workspace.id,
      actor: {
        type: 'key',
        id: rootKey.id,
        name: rootKey.name
      },
      resources: [
        {
          id: endpoint.id,
          type: 'endpoint'
        }
      ],
      description: `Deleted ${endpoint.id}`,
      context: {
        location: context.get('location'),
        userAgent: context.get('userAgent')
      }
    });

    return context.json({}, 200);
  });
};
