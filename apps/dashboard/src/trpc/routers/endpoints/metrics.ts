import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

const generateLast30DaysData = (
  rows: {submissions: number; dateTime: string}[]
) => {
  // Step 1: Create a map from the input rows, normalizing the keys to date-only
  const dataMap = new Map(
    rows.map(row => {
      const dateOnly = row.dateTime.split(' ')[0]; // Extract the date part (YYYY-MM-DD)
      return [dateOnly, row.submissions];
    })
  );

  // Step 2: Generate the last 30 days as ISO date strings
  const now = new Date();
  const chartData = [];

  for (let i = 29; i >= 0; i--) {
    const pastDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
    );
    const isoDate = pastDate.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)

    chartData.push({
      dateTime: `${isoDate}T00:00:00.000Z`,
      submissions: dataMap.get(isoDate) || 0
    });
  }

  return chartData;
};

const generateLast24HoursData = (
  rows: {submissions: number; dateTime: string}[]
) => {
  // Step 1: Create a map from the query result for quick lookup
  const dataMap = new Map(
    rows.map(row => [new Date(row.dateTime).toISOString(), row.submissions])
  );

  // Step 2: Generate the last 24 hours as ISO strings in UTC
  const now = new Date();
  const chartData = [];

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours() - i
      )
    ); // Set to the start of each hour in UTC
    const isoDateTime = hour.toISOString();

    // Step 3: Fill in the data or default to 0 if no submissions
    chartData.push({
      dateTime: isoDateTime,
      submissions: dataMap.get(isoDateTime) || 0
    });
  }

  return chartData;
};

export const getEndpointMetrics = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (!endpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Endpoint not found.'
      });
    }

    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.id, endpoint.workspaceId)
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

    const {data, error} = await ctx.vault.endpoints.metrics({
      endpointId: endpoint.id
    });

    if (error && error.status !== 404) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }

    const monthResponse = await ctx.analytics.queryFormizeeMetricsSubmissions(
      endpoint.id,
      '30d'
    );

    const dayResponse = await ctx.analytics.queryFormizeeMetricsSubmissions(
      endpoint.id,
      '24h'
    );

    const monthMetrics = generateLast30DaysData(monthResponse ?? []);
    const dayMetrics = generateLast24HoursData(dayResponse ?? []);

    const response = {
      totalSubmissions: data?.totalSubmissions,
      '30d': monthMetrics,
      '24h': dayMetrics
    };

    return response;
  });
