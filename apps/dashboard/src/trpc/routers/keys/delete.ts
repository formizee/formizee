import {database, eq, schema} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

export const deleteKey = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .mutation(async ({input, ctx}) => {
    const key = await database.query.key.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (!key) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Key not found.'
      });
    }

    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.id, key.workspaceId)
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

    const deletedKey = await database
      .delete(schema.key)
      .where(eq(schema.key.id, key.id))
      .returning();

    if (!deletedKey[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The key can't be deleted, please contact to support@formizee.com"
      });
    }

    return {id: deletedKey[0].id};
  });
