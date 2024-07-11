import {z} from '@hono/zod-openapi';
import {ColorEnum, IconEnum, APIKeyScopeEnum} from 'domain/models/values';

export const UuidSchema = z
  .string()
  .length(22)
  .regex(/^[a-zA-Z0-9-]+$/)
  .openapi({example: 'oxLSYCTK9zEEKNd2W7sUDB'});

export const TeamSchema = z
  .object({
    id: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
    name: z.string().openapi({
      example: 'formizee'
    }),
    plan: z.enum(['hobby', 'professional', 'teams', 'custom']).openapi({
      example: 'hobby'
    }),
    availableEmails: z
      .string()
      .email()
      .array()
      .openapi({
        example: ['example@formizee.com', 'contact@formizee.com']
      }),
    createdAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    }),
    updatedAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    })
  })
  .openapi('Team');

export const UserSchema = z
  .object({
    id: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
    name: z.string().openapi({
      example: 'pauchiner'
    }),
    email: z.string().email().openapi({
      example: 'pauchiner@formizee.com'
    }),
    isVerified: z.boolean().openapi({
      example: true
    }),
    linkedEmails: z
      .object({
        email: z.string().email(),
        isVerified: z.boolean()
      })
      .array()
      .openapi({
        example: [
          {email: 'pauchiner@formizee.com', isVerified: true},
          {email: 'support@formizee.com', isVerified: false}
        ]
      }),
    createdAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    }),
    updatedAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    })
  })
  .openapi('User');

export const MemberSchema = z
  .object({
    id: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
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
  })
  .openapi('Member');

export const EndpointSchema = z
  .object({
    id: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
    name: z.string().openapi({
      example: 'My Endpoint'
    }),
    team: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
    isEnabled: z.boolean().openapi({
      example: true
    }),
    emailNotifications: z.boolean().openapi({
      example: true
    }),
    redirectUrl: z.string().url().openapi({
      example: 'https://formizee.com/thanks-you'
    }),
    targetEmails: z
      .string()
      .email()
      .array()
      .openapi({
        example: ['pauchiner@formizee.com', 'contact@formizee.com']
      }),
    color: z.enum(ColorEnum),
    icon: z.enum(IconEnum),
    createdAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    }),
    updatedAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    })
  })
  .openapi('Endpoint');

export const SubmissionSchema = z
  .object({
    id: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
    endpoint: z.string().openapi({
      example: 'TjSLj5Z0r4B_H'
    }),
    data: z
      .object({})
      .passthrough()
      .openapi({
        example: {name: 'example', email: 'example@formizee.com'},
        type: 'object'
      }),
    isSpam: z.boolean().openapi({
      example: false
    }),
    isRead: z.boolean().openapi({
      example: true
    }),
    createdAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    })
  })
  .openapi('Submission');

export const APIKeySchema = z
  .object({
    id: z.string().openapi({
      example: 'TjSLj5Z0r4BsH'
    }),
    scope: z.enum(APIKeyScopeEnum).openapi({
      example: 'full-access'
    }),
    userId: z.string().openapi({
      example: 'TjSLj5Z0r4BsH'
    }),
    teamId: z.string().optional().openapi({
      example: 'TjSLj5Z0r4BsH'
    }),
    lastAccess: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    }),
    expiresAt: z
      .date()
      .or(z.enum(['never']))
      .openapi({
        example: '2024-06-30T17:33:32.125Z'
      }),
    createdAt: z.date().openapi({
      example: '2024-06-30T17:33:32.125Z'
    })
  })
  .openapi('API Key');

export const ErrorSchema = z
  .object({
    name: z.string().openapi({
      example: 'Error type'
    }),
    description: z.string().openapi({
      example: 'Detailed description about it.'
    })
  })
  .openapi('Error');
