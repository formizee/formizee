import {z} from '@hono/zod-openapi';
import {UuidSchema} from '@/schemas';

const nameSchema = z
  .string()
  .min(4, {message: 'Name must be between 4 and 32 characters long'})
  .max(32, {message: 'Name must be between 4 and 32 characters long'})
  .regex(/^[a-z0-9.-]+$/, {
    message: 'Name must only contain lowercase letters and numbers'
  })
  .openapi({example: 'formizee'});

export const GetAllEndpointsSchema = z.object({
  team: nameSchema
});

export const GetEndpointSchema = z.object({
  team: nameSchema,
  endpointId: UuidSchema
});

export const PostEndpointParamSchema = z.object({
  team: nameSchema
});

export const PostEndpointJsonSchema = z.object({
  name: z.string().min(8).max(64).openapi({
    example: 'My Startup Waitlist'
  }),
  targetEmails: z
    .string()
    .email()
    .array()
    .openapi({
      example: ['example@formizee.com']
    })
});

export const PatchEndpointParamSchema = z.object({
  team: nameSchema,
  endpointId: UuidSchema
});

export const PatchEndpointJsonSchema = z.object({
  name: z.string().min(8).max(64).optional().openapi({
    example: 'My New Startup Waitlist'
  }),
  isEnabled: z.boolean().optional().openapi({
    example: true
  }),
  emailNotifications: z.boolean().optional().openapi({
    example: true
  }),
  redirectUrl: z.string().url().optional().openapi({
    example: 'https://formizee.com/thanks-you'
  }),
  targetEmails: z
    .string()
    .email()
    .array()
    .optional()
    .openapi({
      example: ['example@formizee.com', 'support@formizee.com']
    })
});

export const DeleteEndpointSchema = z.object({
  team: nameSchema,
  endpointId: UuidSchema
});
