import {HTTPException} from 'hono/http-exception';
import type {MiddlewareHandler} from 'hono';
import {db, eq, schema} from '@formizee/db';
import {getLimits} from '@formizee/plans';
import {sha256} from '@formizee/hashing';
import {env} from '../enviroment';

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

    if (env.NODE_ENV === 'test' && authorization === '1') {
      context.set('user', {
        id: 'id_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
        name: 'pauchiner',
        slug: 'pauchiner',
        isVerified: true,
        email: 'pauchiner@formizee.com'
      });
      context.set('workspace', {
        id: 'ws_9CWDA9MKp3UHDwyqxrBt5AbEWfJ',
        slug: 'formizee',
        stripeId: 'stripeId1',
        subscriptionId: 'subscriptionId',
        availableEmails: ['pauchiner@formizee.com'],
        plan: 'pro',
        endsAt: null,
        paidUntil: null
      });
      context.set('limits', {
        title: 'Pro',
        description: 'For small projects',
        price: 5,
        limits: {
          support: 'email',
          endpoints: 'unlimited',
          submissions: 1000,
          storage: 1000,
          members: 1
        }
      });
      await next();
      return;
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

    const user = await db.query.user.findFirst({
      where: (table, {eq}) => eq(table.id, key.userId),
      with: {usersToWorkspaces: true}
    });
    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found.'
      });
    }

    await db
      .update(schema.key)
      .set({lastAccess: new Date()})
      .where(eq(schema.key.id, key.id));

    context.set('user', user);
    context.set('workspace', workspace);
    context.set('limits', getLimits(workspace.plan));

    const permissions = user.usersToWorkspaces.find(
      relation => relation.workspaceId,
      key.workspaceId
    )?.permissions;
    if (!permissions) {
      throw new HTTPException(403, {
        message: 'Invalid member permissions.'
      });
    }

    const createPermissions = permissions === 'all' || permissions === 'create';
    const deletePermissions = permissions === 'all';
    const editPermissions = permissions !== 'read';
    const method = context.req.method;

    if (method === 'POST' && !createPermissions) {
      throw new HTTPException(401, {
        message: 'You need `create` permissions to perform this action.'
      });
    }

    if (method === 'PUT' && !editPermissions) {
      throw new HTTPException(401, {
        message: 'You need `edit` permissions to perform this action.'
      });
    }

    if (method === 'DELETE' && !deletePermissions) {
      throw new HTTPException(401, {
        message: 'You need to be admin to perform this action.'
      });
    }

    await next();
  };
};
