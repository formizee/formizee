import {UuidSchema} from '@/schemas';
import {z} from '@hono/zod-openapi';
import {APIKeyExpirationDateEnum} from 'domain/models/values';

export const PostAPIKeySchema = z.object({
  expirationDate: z.enum(APIKeyExpirationDateEnum),
  scope: z.enum(['full-access', 'team']),
  team: z.string().optional()
});

export const DeleteAPIKeySchema = z.object({
  apiKeyId: UuidSchema
});
