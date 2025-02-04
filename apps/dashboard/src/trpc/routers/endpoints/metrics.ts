import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';
import {
  authorize,
  generateLast24HoursData,
  generateLast30DaysData
} from '@/trpc/utils';

export const getEndpointMetrics = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query(async ({input, ctx}) => {
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

    const authorized = await authorize({id: endpoint.workspaceId}, ctx);

    if (!authorized.workspace) {
      throw authorized.error;
    }

    const [totalSubmissions, monthResponse, dayResponse] = await Promise.all([
      await ctx.analytics.submissions.perEndpoint({endpointId: endpoint.id}),
      await ctx.analytics.submissions.perMonth({endpointId: endpoint.id}),
      await ctx.analytics.submissions.perDay({endpointId: endpoint.id})
    ]);

    const monthMetrics = generateLast30DaysData(
      monthResponse.err ? [] : monthResponse.val
    );
    const dayMetrics = generateLast24HoursData(
      dayResponse.err ? [] : dayResponse.val
    );

    const response = {
      totalSubmissions: totalSubmissions.err
        ? 0
        : totalSubmissions.val[0]?.submissions,
      '30d': monthMetrics,
      '24h': dayMetrics
    };

    return response;
  });
