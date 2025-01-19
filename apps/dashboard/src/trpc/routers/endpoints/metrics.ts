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
        ctx.metrics.emit({
          metric: 'main.db.read',
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
      await ctx.analytics.queryFormizeeMetricsTotalSubmissions(endpoint.id),
      await ctx.analytics.queryFormizeeMetricsSubmissions(endpoint.id, '30d'),
      await ctx.analytics.queryFormizeeMetricsSubmissions(endpoint.id, '24h')
    ]);

    const monthMetrics = generateLast30DaysData(monthResponse);
    const dayMetrics = generateLast24HoursData(dayResponse);

    const response = {
      totalSubmissions,
      '30d': monthMetrics,
      '24h': dayMetrics
    };

    return response;
  });
