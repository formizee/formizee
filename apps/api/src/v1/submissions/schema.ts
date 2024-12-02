import {MetadataSchema} from '@/lib/pagination';
import {z} from '@hono/zod-openapi';

export const ParamsSchema = z.object({
  id: z.string().openapi({
    description: 'The id of the submission',
    example: 'sub_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  endpointId: z.string().openapi({
    description: 'The id of the endpoint',
    example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  })
});

export const EndpointParamsSchema = z.object({
  endpointId: z.string().openapi({
    description: 'The id of the endpoint',
    example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  })
});

export const SubmissionSchema = z.object({
  id: z.string().openapi({
    description: 'The id of the submission',
    example: 'sub_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  endpointId: z.string().openapi({
    description: 'The id of the endpoint',
    example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  data: z
    .object({})
    .passthrough()
    .openapi({
      description: 'The data of the submission in json format',
      example: {exampleValue: 'foo'}
    }),
  location: z.string().openapi({
    description: 'The origin location of the submission',
    example: 'Spain'
  }),
  isSpam: z.boolean().openapi({
    description: 'Shows if the submission is marked as spam',
    example: false
  }),
  isRead: z.boolean().openapi({
    description: 'Shows if the submission is already readed',
    example: false
  })
});

export const InsertSubmissionSchema = z.object({
  data: z
    .object({})
    .passthrough()
    .openapi({
      description: 'The data of the submission in json format',
      example: {exampleValue: 'foo'}
    })
});

export const UpdateSubmissionSchema = z.object({
  isSpam: z.boolean().openapi({
    description: 'Shows if the submission is marked as spam',
    example: false
  }),
  isRead: z.boolean().openapi({
    description: 'Shows if the submission is already readed',
    example: false
  })
});

const SubmissionDataSchema = z
  .object({})
  .passthrough()
  .openapi({
    description: 'The data of the submission in json format',
    example: {exampleValue: 'foo'}
  });

const ListSubmissionsSchema = z.object({
  schema: z.object({
    _metadata: MetadataSchema,
    submissions: SubmissionSchema.array()
  })
});

const PostSubmissionResponse = SubmissionSchema.omit({data: true});

export type RequestPostSubmission = z.infer<typeof SubmissionDataSchema>;
export type ResponsePostSubmission = z.infer<typeof PostSubmissionResponse>;

export type RequestPutSubmission = z.infer<typeof UpdateSubmissionSchema>;

export type ResponseListSubmissions = z.infer<typeof ListSubmissionsSchema>;

export type ResponseSubmission = z.infer<typeof SubmissionSchema>;
