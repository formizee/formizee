import {ParamsSchema, StorageSchema} from './schema';
import {assignOriginDatabase} from '@/lib/databases';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute, z} from '@hono/zod-openapi';
import {eq, schema} from '@formizee/db/submissions';
import type {storage as storageAPI} from '.';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Storage'],
  summary: 'Updates the storage used by the endpoint',
  path: '/{endpointId}',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: StorageSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Create a submission',
      content: {
        'application/json': {
          schema: z.object({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPutStorage = (api: typeof storageAPI) => {
  return api.openapi(putRoute, async context => {
    const {metrics, database, cache} = context.get('services');
    const {endpointId} = context.req.valid('param');
    const input = context.req.valid('json');
    const mutationStart = performance.now();

    // Assign database
    const originDatabase = await assignOriginDatabase(
      {database, cache},
      endpointId
    );

    if (!originDatabase) {
      throw new HTTPException(404, {
        message:
          'Origin database not found, please contact support@formizee.com'
      });
    }

    const endpoint = await originDatabase
      .select({storageUsed: schema.endpoint.storageUsed})
      .from(schema.endpoint)
      .where(eq(schema.endpoint.id, endpointId))
      .get();
    if (!endpoint) {
      throw new HTTPException(404, {
        message: 'Endpoint not found'
      });
    }

    await originDatabase
      .update(schema.endpoint)
      .set({
        storageUsed: endpoint.storageUsed + input.storageUsed
      })
      .where(eq(schema.endpoint.id, endpointId));

    metrics.emit({
      metric: 'vault.latency',
      query: 'storage.post',
      latency: performance.now() - mutationStart
    });

    return context.json({}, 200);
  });
};
