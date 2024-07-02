import {z} from '@hono/zod-openapi';

export const GetAllSubmissionsSchema = z.object({
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  })
});

export const GetSubmissionSchema = z.object({
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  }),
  submissionId: z.string().openapi({
    example: '68xtMDHvvwCXFnMW11s9h1'
  })
});

export const PostSubmissionSchema = z.object({
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  }),
  submissionId: z.string().openapi({
    example: '68xtMDHvvwCXFnMW11s9h1'
  })
});

export const UpdateSubmissionParamSchema = z.object({
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  }),
  submissionId: z.string().openapi({
    example: '68xtMDHvvwCXFnMW11s9h1'
  })
});

export const UpdateSubmissionJsonSchema = z.object({
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
  endpointId: z.string().openapi({
    example: 'oxLSYCTK9zEEKNd2W7sUDB'
  }),
  submissionId: z.string().openapi({
    example: '68xtMDHvvwCXFnMW11s9h1'
  })
});
