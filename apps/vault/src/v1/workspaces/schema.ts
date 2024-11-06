import {z} from '@hono/zod-openapi';

export const WorkspaceSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the workspace',
      example: 'ws_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    }),
  createdAt: z.string().datetime().openapi({
    description: 'The creation date of the bucket'
  })
});

export const PostWorkspaceSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the workspace',
      example: 'ws_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});

export const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the workspace',
      example: 'ws_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});

export type RequestPostWorkspace = z.infer<typeof PostWorkspaceSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
