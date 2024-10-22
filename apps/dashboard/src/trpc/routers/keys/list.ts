import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const listKeys = protectedProcedure
  .input(
    z.object({
      workspaceSlug: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.slug, input.workspaceSlug)
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found.'
      });
    }

    const authorized = await database.query.usersToWorkspaces.findFirst({
      where: (table, {and, eq}) =>
        and(
          eq(table.userId, ctx.user.id ?? ''),
          eq(table.workspaceId, workspace.id)
        )
    });

    if (!authorized) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to view this workspace.'
      });
    }

    const data = await database.query.key.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id)
    });

    const keys = data.map(key => {
      const lastAccess =
        key.lastAccess.getTime() === key.createdAt.getTime()
          ? 'Never'
          : key.lastAccess;

      const expiresAt =
        key.expiresAt.getFullYear() > 4000 ? 'Never' : key.expiresAt;

      return {...key, lastAccess, expiresAt};
    });

    return keys;
  });
