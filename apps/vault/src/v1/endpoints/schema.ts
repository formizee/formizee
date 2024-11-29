import {z} from '@hono/zod-openapi';

export const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});
