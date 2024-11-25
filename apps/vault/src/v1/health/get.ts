import {openApiErrorResponses} from '@/lib/errors';
import {createRoute} from '@hono/zod-openapi';
import type {health as healthAPI} from '.';
import {z} from 'zod';

export const getRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get Vault status',
  description: 'Returns the Formizee Vault status',
  operationId: 'getStatus',
  tags: ['Health'],
  security: [],
  responses: {
    200: {
      description: 'The Vault is running correctly',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string()
          }),
          example: {status: 'OK'}
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerGetStatus = (api: typeof healthAPI) => {
  return api.openapi(getRoute, context => context.json({status: 'OK'}, 200));
};
