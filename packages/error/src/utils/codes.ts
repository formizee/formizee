import {z} from '@hono/zod-openapi';

export const ErrorCodeEnum = z.enum([
  'BAD_REQUEST',
  'FORBIDDEN',
  'INTERNAL_SERVER_ERROR',
  'TOO_MANY_REQUESTS',
  'USAGE_EXCEEDED',
  'DISABLED',
  'CONFLICT',
  'NOT_FOUND',
  'NOT_UNIQUE',
  'UNAUTHORIZED',
  'METHOD_NOT_ALLOWED',
  'UNPROCESSABLE_ENTITY'
]);

export type ErrorCode = z.infer<typeof ErrorCodeEnum>;
