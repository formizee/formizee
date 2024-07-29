import {openApiErrorResponses} from '@/lib/errors';
import {createRoute} from '@hono/zod-openapi';
import type {health as healthAPI} from '.';
import {z} from 'zod';

export const getRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get API status',
  description: 'Returns the Formizee API status',
  operationId: 'getStatus',
  tags: ['Health'],
  security: [],
  responses: {
    200: {
      description: 'The API is running correctly',
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
