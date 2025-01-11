import {database, eq, schema} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
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

    const {workspace, error} = await authorize({id: key.workspaceId}, ctx);

    if (!workspace) {
      throw error;
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

    // Ingest audit logs
    await ctx.analytics.ingestFormizeeAuditLogs({
      event: 'key.delete',
      workspaceId: workspace.id,
      actor: {
        type: 'user',
        id: ctx.user.id ?? 'Not available',
        name: ctx.user.name ?? 'Not available'
      },
      resources: [
        {
          id: key.id,
          type: 'key'
        }
      ],
      description: `Deleted ${key.id}`,
      context: {
        location: ctx.audit.location,
        userAgent: ctx.audit.userAgent
      }
    });

    return {id: deletedKey[0].id};
  });
