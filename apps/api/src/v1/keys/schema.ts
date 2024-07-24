import {schema} from '@formizee/db';
import {z} from '@hono/zod-openapi';

export const KeySchema = z.object({
  id: z.string().openapi({
    description: 'The id of the key',
    example: 'key_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  name: z
    .string()
    .min(4, {message: 'The name must be between 4 and 64 characters long.'})
    .max(64, {message: 'The name must be between 4 and 64 characters long.'})
    .openapi({
      description: 'The name of the key',
      example: 'My New Key'
    }),
  workspaceId: z.string().openapi({
    description: 'The id of the workspace',
    example: 'ws_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  lastAccess: z.date().optional().openapi({
    description: 'The last time the key was used',
    example: '2024-07-23 12:41:45.38215'
  }),
  expiresAt: z.date().openapi({
    description: 'The expiration date of the key',
    example: '2024-07-23 12:41:45.38215'
  })
});

export const VerifyKeySchema = z.object({
  key: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the key',
      example: 'key_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});

export const InsertKeySchema = z.object({
  name: z
    .string()
    .min(4, {message: 'The name must be between 4 and 64 characters long.'})
    .max(64, {message: 'The name must be between 4 and 64 characters long.'})
    .openapi({
      description: 'The name of the key',
      example: 'My New Key'
    }),
  expiresAt: z.enum(schema.apiKeyExpirationDate).openapi({
    description: 'The expiration date of the key',
    example: '90-days'
  })
});

export const ParamsKeySchema = z.object({
  id: z.string().openapi({
    description: 'The id of the key',
    example: 'key_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  })
});

export type RequestParamsKey = z.infer<typeof ParamsKeySchema>;
export type RequestVerifyKey = z.infer<typeof VerifyKeySchema>;
export type RequestPostKey = z.infer<typeof InsertKeySchema>;
export type RequestPutKey = z.infer<typeof InsertKeySchema>;
export type ResponseKey = z.infer<typeof KeySchema>;
