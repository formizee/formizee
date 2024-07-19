import {openApiErrorResponses} from '@/lib/errors/openapi-error-responses';
import {createRoute} from '@hono/zod-openapi';
import type {healthAPI} from '.';
import {z} from 'zod';

export const getRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get API status',
  description: 'Returns the Formizee API status',
  operationId: 'status',
  tags: ['Health'],
  security: [],
  responses: {
    200: {
      description: 'The API is running correctly',
      content: {
        'text/plain': {
          schema: z.string(),
          example: 'OK'
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerGetStatus = (api: typeof healthAPI) => {
  return api.openapi(getRoute, context => context.text('OK', 200));
};
