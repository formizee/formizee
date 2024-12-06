import {assignOriginDatabase} from '@/lib/databases';
import {ParamsSchema, StorageSchema} from './schema';
import {HTTPException} from 'hono/http-exception';
import {eq, schema} from '@formizee/db/submissions';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute} from '@hono/zod-openapi';
import type {storage as storageAPI} from '.';

export const getRoute = createRoute({
  method: 'get',
  tags: ['Storage'],
  summary: 'Get endpoint used storage',
  path: '/{endpointId}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Get endpoint used storage',
      content: {
        'application/json': {
          schema: StorageSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerGetStorage = (api: typeof storageAPI) => {
  return api.openapi(getRoute, async context => {
    const {database, cache} = context.get('services');
    const {endpointId} = context.req.valid('param');

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

    // Query storage
    const cachedResponse = await cache.getStorageUsed(endpointId);
    if (cachedResponse) {
      return context.json({storageUsed: cachedResponse}, 200);
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

    return context.json({storageUsed: endpoint.storageUsed}, 200);
  });
};
