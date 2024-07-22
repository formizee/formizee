import {HTTPException} from 'hono/http-exception';
import type {MiddlewareHandler} from 'hono';
import {db, eq, schema} from '@formizee/db';
import {getLimits} from '@formizee/plans';
import {sha256} from '@formizee/hashing';

export const authentication = (): MiddlewareHandler => {
  return async function auth(context, next) {
    const authorization = context.req
      .header('authorization')
      ?.replace('Bearer ', '');
    if (!authorization) {
      throw new HTTPException(401, {
        message: 'API key required.'
      });
    }

    const hash = await sha256(authorization);

    const key = await db.query.key.findFirst({
      where: (table, {eq}) => eq(table.hash, hash)
    });
    if (!key) {
      throw new HTTPException(401, {
        message: 'The API key is not valid.'
      });
    }

    const isExpired = new Date() > key.expiresAt;
    if (isExpired) {
      await db.delete(schema.key).where(eq(schema.key.id, key.id));

      throw new HTTPException(401, {
        message: 'The API key is expired.'
      });
    }

    const workspace = await db.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.id, key.workspaceId)
    });
    if (!workspace) {
      throw new HTTPException(404, {
        message: 'Workspace not found.'
      });
    }

    await db
      .update(schema.key)
      .set({lastAccess: new Date()})
      .where(eq(schema.key.id, key.id));

    context.set('workspace', workspace);
    context.set('limits', getLimits(workspace.plan));

    await next();
  };
};
