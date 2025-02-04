import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const updateKey = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string()
    })
  )
  .mutation(async ({input, ctx}) => {
    const queryStart = performance.now();
    const key = await database.query.key
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'keys.get',
          latency: performance.now() - queryStart
        });
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

    try {
      const mutationStart = performance.now();
      const updatedKey = await database
        .update(schema.key)
        .set({name: input.name ?? key.name})
        .where(eq(schema.endpoint.id, key.id))
        .returning()
        .finally(() => {
          ctx.analytics.metrics.insertDatabase({
            type: 'write',
            query: 'keys.put',
            latency: performance.now() - mutationStart
          });
        });

      // Ingest audit logs
      await ctx.analytics.auditLogs.insert({
        time: Date.now(),
        event: 'key.update',
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
        description: `Updated ${key.id} name to ${input.name}`,
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent
        }
      });

      return updatedKey[0];
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The key can't be updated, please contact to support@formizee.com"
      });
    }
  });
