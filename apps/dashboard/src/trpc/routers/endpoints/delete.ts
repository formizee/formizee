import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const deleteEndpoint = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .mutation(async ({input, ctx}) => {
    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'endpoints.get',
          latency: performance.now() - queryStart
        });
      });

    if (!endpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Endpoint not found.'
      });
    }

    const {workspace, error} = await authorize({id: endpoint.workspaceId}, ctx);

    if (!workspace) {
      throw error;
    }

    const mutationStart = performance.now();
    const deletedEndpoint = await database
      .delete(schema.endpoint)
      .where(eq(schema.endpoint.id, endpoint.id))
      .returning()
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'write',
          query: 'endpoints.delete',
          latency: performance.now() - mutationStart
        });
      });

    if (!deletedEndpoint[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The endpoint can't be deleted, please contact to support@formizee.com"
      });
    }

    await ctx.analytics.auditLogs.insert({
      time: Date.now(),
      event: 'endpoint.delete',
      workspaceId: workspace.id,
      actor: {
        type: 'user',
        id: ctx.user.id ?? 'Not available',
        name: ctx.user.name ?? 'Not available'
      },
      resources: [
        {
          id: endpoint.id,
          type: 'endpoint'
        }
      ],
      description: `Deleted ${endpoint.id}`,
      context: {
        location: ctx.audit.location,
        userAgent: ctx.audit.userAgent
      }
    });

    return {id: deletedEndpoint[0].id};
  });
