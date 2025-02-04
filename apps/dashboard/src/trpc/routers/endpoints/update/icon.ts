import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const updateEndpointIcon = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      icon: z.enum(schema.endpointIcon)
    })
  )
  .mutation(async ({input, ctx}) => {
    const endpointQueryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'endpoints.get',
          latency: performance.now() - endpointQueryStart
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

    try {
      const mutationStart = performance.now();
      const updatedEndpoint = await database
        .update(schema.endpoint)
        .set({icon: input.icon ?? endpoint.icon})
        .where(eq(schema.endpoint.id, endpoint.id))
        .returning()
        .finally(() => {
          ctx.analytics.metrics.insertDatabase({
            type: 'write',
            query: 'endpoints.put',
            latency: performance.now() - mutationStart
          });
        });

      return updatedEndpoint[0];
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The endpoint can't be updated, please contact to support@formizee.com"
      });
    }
  });
