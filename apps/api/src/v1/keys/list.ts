import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import type {listKeys as keysApi} from '.';
import {KeySchema} from './schema';
import {db} from '@formizee/db';

export const listRoute = createRoute({
  method: 'get',
  tags: ['Keys'],
  summary: 'List keys',
  path: '/',
  responses: {
    200: {
      description: 'List keys',
      content: {
        'application/json': {
          schema: KeySchema.array()
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerListKeys = (api: typeof keysApi) => {
  return api.openapi(listRoute, async context => {
    const workspace = context.get('workspace');

    const keys = await db.query.key.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id)
    });

    if (!keys) {
      throw new HTTPException(404, {
        message: 'Keys not found'
      });
    }

    const response = keys.map(key => KeySchema.parse(key));
    return context.json(response, 200);
  });
};
