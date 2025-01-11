import {database, type schema} from '@/lib/db';
import type {Metrics} from '@formizee/metrics';
import {TRPCError} from '@trpc/server';
import type {User} from 'next-auth';

type InputLike =
  | {
      workspaceSlug: string;
      workspaceId?: undefined;
    }
  | {
      workspaceSlug?: undefined;
      workspaceId: string;
    };

interface ContextLike {
  user: User;
  metrics: Metrics;
}

export const authorize = async (
  input: InputLike,
  ctx: ContextLike
): Promise<
  | {workspace: schema.Workspace; error: null}
  | {workspace: null; error: TRPCError}
> => {
  const type = input.workspaceSlug !== undefined ? 'slug' : 'id';
  const inputValue =
    input.workspaceSlug !== undefined ? input.workspaceSlug : input.workspaceId;

  const workspaceQueryStart = performance.now();
  const workspace = await database.query.workspace
    .findFirst({
      where: (table, {eq}) => eq(table[type], inputValue)
    })
    .finally(() => {
      ctx.metrics.emit({
        metric: 'main.db.read',
        query: 'workspaces.get',
        latency: performance.now() - workspaceQueryStart
      });
    });

  if (!workspace) {
    return Promise.resolve({
      workspace: null,
      error: new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found.'
      })
    });
  }

  const authorizedQueryStart = performance.now();
  const authorized = await database.query.usersToWorkspaces
    .findFirst({
      where: (table, {and, eq}) =>
        and(
          eq(table.userId, ctx.user.id ?? ''),
          eq(table.workspaceId, workspace.id)
        )
    })
    .finally(() => {
      ctx.metrics.emit({
        metric: 'main.db.read',
        query: 'usersToWorkspaces.get',
        latency: performance.now() - authorizedQueryStart
      });
    });

  if (!authorized) {
    return Promise.resolve({
      workspace: null,
      error: new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to view this workspace.'
      })
    });
  }

  return Promise.resolve({
    workspace,
    error: null
  });
};
