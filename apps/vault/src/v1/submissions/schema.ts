import {z} from '@hono/zod-openapi';

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

export const PutSchema = z.object({
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
      message:
        'Invalid endpoint identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  isRead: z.boolean().optional(),
  isSpam: z.boolean().optional()
});

export const PostSchema = z.object({
  endpointId: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  data: z.custom<Record<string, string>>().openapi({
    description: 'The data of the submission in json (key-value) format',
    example: {field1: 'value1', field2: 'value2'}
  }),
  fileUploads: z
    .object({
      field: z.string(),
      name: z.string()
    })
    .array()
    .openapi({
      description: 'The files of the submission in json (key-value) format',
      example: [
        {field: 'file1', name: 'file1.txt'},
        {field: 'file2', name: 'file2.png'}
      ]
    }),
  location: z.string()
});

export const PostResponseSchema = z.object({
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
  pendingUploads: z
    .object({
      field: z.string(),
      url: z.string().url()
    })
    .array()
    .openapi({
      description: 'The pending upload urls',
      example: [{field: 'file1', url: 'https://url.com'}]
    }),

  isSpam: z.boolean(),
  isRead: z.boolean(),
  location: z.string(),
  createdAt: z.date()
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

  data: z.custom<Record<string, string>>().openapi({
    description: 'The data of the submission in json (key-value) format',
    example: {foo: 'bar', bar: 'foo'}
  }),
  isSpam: z.boolean(),
  isRead: z.boolean(),
  location: z.string(),
  createdAt: z.date()
});
