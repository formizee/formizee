import {InsertKeySchema, KeySchema} from './schema';
import {db, count, schema, eq} from '@formizee/db';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import type {keys as keysAPI} from '.';
import {newId} from '@formizee/id';

export const postRoute = createRoute({
  method: 'post',
  tags: ['Keys'],
  summary: 'Create a API key',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: InsertKeySchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Create a key',
      content: {
        'application/json': {
          schema: KeySchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPostKey = (api: typeof keysAPI) => {
  return api.openapi(postRoute, async context => {
    const {keyService} = context.get('services');
    const workspace = context.get('workspace');
    const input = context.req.valid('json');
    const limits = context.get('limits');

    // Check plan limits.
    const keys = await db
      .select({count: count()})
      .from(schema.key)
      .where(eq(schema.key.workspaceId, workspace.id));

    if (!keys[0]) {
      throw new HTTPException(500, {
        message: 'Server Internal Error.'
      });
    }

    if (typeof limits.keys === 'number' && keys[0].count >= limits.keys) {
      throw new HTTPException(403, {
        message: 'Upgrade for more API keys.'
      });
    }

    const {val, err} = await keyService.createKey(input.expiresAt);

    if (err || !val) {
      throw new HTTPException(500, {
        message: err.message
      });
    }

    const data: schema.InsertKey = {
      id: newId('api'),
      hash: val.hash,
      name: input.name,
      expiresAt: val.expiresAt,
      workspaceId: workspace.id
    };

    await db.insert(schema.key).values(data);

    const response = KeySchema.parse(data);
    return context.json(response, 201);
  });
};
