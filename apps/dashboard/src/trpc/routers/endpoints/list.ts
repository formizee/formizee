import {auth, trpcServer, TRPCError} from '../../server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const listEndpoints = trpcServer.procedure
  .use(auth)
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
        message: 'The workspace does not exist.'
      });
    }

    const isMember = await database.query.usersToWorkspaces.findFirst({
      where: (table, {and, eq}) =>
        and(
          eq(table.workspaceId, workspace.id),
          eq(table.userId, ctx.user.id ?? '')
        )
    });

    if (!isMember) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to view this workspace.'
      });
    }

    const endpoints = await database.query.endpoint.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id)
    });

    return {endpoints};
  });
