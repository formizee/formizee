import type {workspaces as workspacesAPI} from '.';
import {openApiErrorResponses} from '@/lib/errors';
import {createRoute, z} from '@hono/zod-openapi';
import {HTTPException} from 'hono/http-exception';
import {ParamsSchema} from './schema';

export const deleteRoute = createRoute({
  method: 'delete',
  tags: ['Workspaces'],
  summary: 'Delete a workspace bucket',
  path: '/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      description: 'Delete a workspace bucket',
      content: {
        'application/json': {
          schema: z.object({})
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerDeleteWorkspace = (api: typeof workspacesAPI) => {
  return api.openapi(deleteRoute, async context => {
    const {id} = context.req.valid('param');

    // Check that the workspace exists
    const workspaceExists = await context.env.VAULT.get(`${id}/_metadata.json`);

    if (!workspaceExists) {
      throw new HTTPException(404, {
        message: 'Workspace not found'
      });
    }

    let cursor: string | undefined = undefined;

    do {
      // List objects with the specified directory path as the prefix
      const objects = await context.env.VAULT.list({prefix: `${id}/`, cursor});
      cursor = objects.truncated ? objects.cursor : undefined;

      // Delete each object within the list
      const deletePromises = objects.objects.map(object =>
        context.env.VAULT.delete(object.key)
      );
      await Promise.all(deletePromises);
    } while (cursor);

    return context.json({}, 200);
  });
};
