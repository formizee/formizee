import {createRoute, z} from '@hono/zod-openapi';
import {ErrorSchema} from '@/schemas';

export const getHealthRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get API status',
  description: 'Returns the Formizee API status',
  operationId: 'status',
  tags: ['Health'],
  security: [],
  responses: {
    200: {
      description: 'OK',
      content: {
        'text/plain': {
          schema: z.string(),
          example: 'OK'
        }
      }
    },
    500: {
      description: 'Internal error',
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      }
    }
  }
});
