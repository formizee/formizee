import {z} from '@hono/zod-openapi';
import {UuidSchema} from '@/schemas';

export const GetAllSubmissionsSchema = z.object({
  endpointId: UuidSchema
});

export const GetSubmissionSchema = z.object({
  endpointId: UuidSchema,
  submissionId: UuidSchema
});

export const PostSubmissionParamSchema = z.object({
  endpointId: UuidSchema
});

export const PatchSubmissionParamSchema = z.object({
  endpointId: UuidSchema,
  submissionId: UuidSchema
});

export const PatchSubmissionJsonSchema = z.object({
  isSpam: z
    .boolean()
    .openapi({
      example: false
    })
    .optional(),
  isRead: z
    .boolean()
    .openapi({
      example: false
    })
    .optional()
});

export const DeleteSubmissionSchema = z.object({
  endpointId: UuidSchema,
  submissionId: UuidSchema
});
