import {z} from '@hono/zod-openapi';

export const PostSchema = z.object({
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
  data: z.string().openapi({
    description: 'The data of the submission in json (key-value) format',
    example: '{"foo": "bar", "bar": "foo"}'
  }),
  fileUploads: z
    .union([z.instanceof(File), z.instanceof(File).array()])
    .optional(),
  location: z.string()
});
