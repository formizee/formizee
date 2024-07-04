import {z} from '@hono/zod-openapi';

export const GetTeamSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  })
});

export const PostTeamSchema = z.object({
  name: z
    .string()
    .min(4, {message: 'Name must be between 4 and 32 characters long'})
    .max(32, {message: 'Name must be between 4 and 32 characters long'})
    .regex(/^[a-z0-9.-]+$/, {
      message: 'Name must only contain lowercase letters and numbers'
    })
    .openapi({example: 'formizee'})
});

export const DeleteTeamSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  })
});

export const GetMembersSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  })
});

export const GetMemberSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  }),
  memberId: z.string().openapi({
    example: '8DsZkwb2CvBZATQoAoyonu'
  })
});

export const PostMemberParamSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  })
});

export const PostMemberJsonSchema = z.object({
  userId: z.string().openapi({
    example: '8DsZkwb2CvBZATQoAoyonu'
  })
});

export const PatchMemberParamSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  }),
  memberId: z.string().openapi({
    example: '8DsZkwb2CvBZATQoAoyonu'
  })
});

export const PatchMemberJsonSchema = z.object({
  role: z.enum(['member', 'owner']).optional().openapi({
    description: 'The owners have full permissions on the team',
    default: 'member',
    example: 'owner'
  }),
  permissions: z
    .enum(['read', 'edit', 'create', 'all'])
    .optional()
    .openapi({
      description: `
    'read' allow the member to see all the endpoints and metrics,
    'edit' allows to modify the endpoints, 
    'create' allows to create new endpoints, 
    and 'all' allows to delete endpoints also, each permission adds to the previous ones,
    for example 'create' also gives the possibility of 'edit'
    `,
      default: 'read',
      example: 'all'
    })
});

export const DeleteMemberSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  }),
  memberId: z.string().openapi({
    example: '8DsZkwb2CvBZATQoAoyonu'
  })
});
