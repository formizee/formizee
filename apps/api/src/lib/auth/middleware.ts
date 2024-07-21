import {HTTPException} from 'hono/http-exception';
import {type schema, db} from '@formizee/db';
import type {MiddlewareHandler} from 'hono';
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

    context.set('auth', {
      user: user,
      workspace: workspace,
      limits: getLimits(workspace.plan)
    });

    const permissions = user.usersToWorkspaces.find(
      relation => relation.workspaceId,
      key.workspaceId
    )?.permissions;
    if (!permissions) {
      throw new HTTPException(403, {
        message: 'Invalid member permissions.'
      });
    }

    authorizeRequests(context.req.method, permissions);

    await next();
  };
};

const authorizeRequests = async (
  method: string,
  permissions: schema.MemberPermissions
) => {
  const createPermissions = permissions === 'all' || permissions === 'create';
  const deletePermissions = permissions === 'all';
  const editPermissions = permissions !== 'read';

  if (method === 'POST' && !createPermissions) {
    throw new HTTPException(401, {
      message: 'Unauthorized, please check your permissions.'
    });
  }

  if (method === 'PATCH' && !editPermissions) {
    throw new HTTPException(401, {
      message: 'Unauthorized, please check your permissions.'
    });
  }

  if (method === 'DELETE' && !deletePermissions) {
    throw new HTTPException(401, {
      message: 'Unauthorized, please check your permissions.'
    });
  }
};
