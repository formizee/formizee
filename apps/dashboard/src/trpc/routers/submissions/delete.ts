import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const deleteSubmission = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      endpointId: z.string()
    })
  )
  .mutation(async ({input, ctx}) => {
    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.endpointId)
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

    const authorized = await authorize({id: endpoint.workspaceId}, ctx);

    if (!authorized.workspace) {
      throw authorized.error;
    }

    const response = await ctx.vault.submissions.delete(input);

    if (response.error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The submission can't be deleted, please contact support@formizee.com"
      });
    }

    return {id: input.id};
  });
