import {router, protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const workspaceRouter = router({
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string().max(64)
      })
    )
    .query(async ({input, ctx}) => {
      const workspace = await database.query.workspace.findFirst({
        where: (table, {eq}) => eq(table.slug, input.slug)
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

      return workspace;
    })
});
