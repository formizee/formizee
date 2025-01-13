import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const updateEndpointColor = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      color: z.enum(schema.endpointColor)
    })
  )
  .mutation(async ({input, ctx}) => {
    const endpointQueryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
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
        .set({color: input.color ?? endpoint.color})
        .where(eq(schema.endpoint.id, endpoint.id))
        .returning()
        .finally(() => {
          ctx.metrics.emit({
            metric: 'main.db.write',
            mutation: 'endpoints.put',
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
