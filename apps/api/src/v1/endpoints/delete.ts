import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import type {endpoints as endpointsAPI} from '.';
import {createRoute, z} from '@hono/zod-openapi';
import {and, eq, schema} from '@formizee/db';
import {ParamsSchema} from './schema';

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
    const {analytics, database, vault, logger} = context.get('services');
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');
    const rootKey = context.get('key');

    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: and(
          eq(schema.endpoint.workspaceId, workspace.id),
          eq(schema.endpoint.id, id)
        )
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

    const mutationStart = performance.now();
    await database
      .delete(schema.endpoint)
      .where(eq(schema.endpoint.id, id))
      .finally(() => {
        analytics.metrics.insertDatabase({
          type: 'write',
          query: 'endpoints.delete',
          latency: performance.now() - mutationStart
        });
      });

    const {error} = await vault.endpoints.delete({endpointId: id});
    if (error) {
      logger.error(`vault.endpoints.delete(${id})`, {error});
      throw new HTTPException(error.status, {
        message: error.message
      });
    }

    await analytics.auditLogs.insert({
      time: Date.now(),
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
