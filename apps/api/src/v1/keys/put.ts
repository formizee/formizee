import {KeySchema, InsertKeySchema, ParamsKeySchema} from './schema';
import {openApiErrorResponses} from '@/lib/errors';
import {HTTPException} from 'hono/http-exception';
import {createRoute} from '@hono/zod-openapi';
import {db, eq, schema} from '@formizee/db';
import type {keys as keysAPI} from '.';

export const putRoute = createRoute({
  method: 'put',
  tags: ['Keys'],
  summary: 'Update a key',
  path: '/{id}',
  request: {
    params: ParamsKeySchema,
    body: {
      content: {
        'application/json': {
          schema: InsertKeySchema.partial()
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Update a key',
      content: {
        'application/json': {
          schema: KeySchema
        }
      }
    },
    ...openApiErrorResponses
  }
});

export const registerPutKey = (api: typeof keysAPI) => {
  return api.openapi(putRoute, async context => {
    const {keyService} = context.get('services');
    const workspace = context.get('workspace');
    const {id} = context.req.valid('param');
    const input = context.req.valid('json');

    const key = await db.query.key.findFirst({
      where: (table, {and, eq}) =>
        and(eq(table.workspaceId, workspace.id), eq(table.id, id))
    });

    if (!key) {
      throw new HTTPException(404, {
        message: 'Key not found'
      });
    }

    if (Object.keys(input).length === 0) {
      throw new HTTPException(400, {
        message: "There's no fields to update"
      });
    }

    let name: string;
    if (input.name !== undefined) {
      name = input.name;
    } else {
      name = key.name;
    }

    let expiresAt: Date;
    if (input.expiresAt !== undefined) {
      expiresAt = keyService.generateExpiracyDate(input.expiresAt);
    } else {
      expiresAt = key.expiresAt;
    }

    const newKey = await db
      .update(schema.key)
      .set({
        ...key,
        name,
        expiresAt
      })
      .where(eq(schema.key.id, id))
      .returning();

    const response = KeySchema.parse(newKey[0]);
    return context.json(response, 200);
  });
};
