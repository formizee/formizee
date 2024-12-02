import {z} from '@hono/zod-openapi';

export const ErrorCodeEnum = z.enum([
  'BAD_REQUEST',
  'FORBIDDEN',
  'INTERNAL_SERVER_ERROR',
  'UNSUPPORTED_MEDIA_TYPE',
  'GATEWAY_TIMEOUT',
  'TOO_MANY_REQUESTS',
  'USAGE_EXCEEDED',
  'DISABLED',
  'CONFLICT',
  'NOT_FOUND',
  'NOT_UNIQUE',
  'UNAUTHORIZED',
  'PAYLOAD_TOO_LARGE',
  'METHOD_NOT_ALLOWED',
  'UNPROCESSABLE_ENTITY'
]);

export type ErrorCode = z.infer<typeof ErrorCodeEnum>;
