import {z} from '@hono/zod-openapi';

export const GetAllEndpointsSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  })
});

export const GetEndpointSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  }),
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  })
});

export const PostEndpointParamSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  })
});

export const PostEndpointJsonSchema = z.object({
  name: z.string().min(8).max(64).openapi({
    example: 'My Startup Waitlist'
  }),
  targetEmails: z
    .string()
    .email()
    .array()
    .optional()
    .openapi({
      example: ['example@formizee.com']
    })
});

export const PatchEndpointParamSchema = z.object({
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  }),
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  })
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
  teamId: z.string().openapi({
    example: 'viCw9Drs7fJJNq42pPq1fH'
  }),
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  })
});
