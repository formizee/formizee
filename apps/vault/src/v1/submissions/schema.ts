import {z} from '@hono/zod-openapi';

export const ListSchema = z.object({
  endpointId: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});

export const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the submission',
      example: 'sub_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  endpointId: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});

export const SubmissionSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the submission',
      example: 'sub_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  endpointId: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  data: z
    .object({})
    .passthrough()
    .openapi({
      description: 'The data of the submission in json format',
      example: {exampleValue: 'foo'}
    })
});

export const ListSubmissionsResponseSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the submission',
      example: 'sub_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  data: z
    .object({})
    .passthrough()
    .openapi({
      description: 'The data of the submission in json format',
      example: {exampleValue: 'foo'}
    })
});

export const ResponseSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the submission',
      example: 'sub_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  endpointId: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  createdAt: z.string().datetime().openapi({
    description: 'The creation date of the submission'
  })
});

export type RequestPostSubmission = z.infer<typeof SubmissionSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
