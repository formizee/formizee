import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const listLogs = protectedProcedure
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

    const response = await ctx.analytics.queryFormizeeAuditLogs(workspace.id);
    return response;
  });
