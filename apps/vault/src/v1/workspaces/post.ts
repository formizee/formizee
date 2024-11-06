import {type Workspace, PostWorkspaceSchema, WorkspaceSchema} from './schema';
import {openApiErrorResponses} from '@/lib/errors';
import type {workspaces as workspacesAPI} from '.';
import {createRoute} from '@hono/zod-openapi';
import {HTTPException} from 'hono/http-exception';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Workspaces'],
  summary: 'Create a workspace bucket',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostWorkspaceSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a workspace bucket',
      content: {
        'application/json': {
          schema: WorkspaceSchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostWorkspace = (api: typeof workspacesAPI) => {
  return api.openapi(postRoute, async context => {
    const input = context.req.valid('json');

    // Check that the workspace doesn't exists
    const workspaceAlreadyExists = await context.env.VAULT.get(
      `${input.id}/_metadata.json`
    );

    if (workspaceAlreadyExists) {
      throw new HTTPException(409, {
        message: 'The workspace already exists'
      });
    }
    const metadata: Workspace = {
      id: input.id,
      createdAt: new Date().toISOString()
    };

    // Create the workspace directory
    await context.env.VAULT.put(
      `${input.id}/_metadata.json`,
      JSON.stringify(metadata)
    );

    const response = WorkspaceSchema.parse(metadata);
    return context.json(response, 201);
  });
};
