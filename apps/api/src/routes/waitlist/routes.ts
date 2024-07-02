import {createRoute, z} from '@hono/zod-openapi';
import {ErrorSchema} from '@/schemas';
import {PostWaitlistSchema} from './schemas';

export const postWaitlistRoute = createRoute({
  method: 'post',
  path: '/join',
  summary: 'Join',
  description: 'Add the given email to the waitlist',
  operationId: 'joinWaitlist',
  tags: ['Waitlist'],
  security: [],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: PostWaitlistSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'User joined successfully',
      content: {
        'text/plain': {
          schema: z.string(),
          example: 'OK'
        }
      }
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: ErrorSchema
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
