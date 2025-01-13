import {calculatePlanCycleDates} from '@formizee/plans';
import {count, database, eq, schema} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

export const getWorkspaceLimits = protectedProcedure
  .input(
    z.object({
      slug: z.string().max(64)
    })
  )
  .query(async ({input, ctx}) => {
    const {workspace, error} = await authorize(
      {workspaceSlug: input.slug},
      ctx
    );

    if (!workspace) {
      throw error;
    }

    const queryEndpointsStart = performance.now();
    const endpoints = await database.query.endpoint
      .findMany({
        where: (table, {eq}) => eq(table.workspaceId, workspace.id)
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.list',
          latency: performance.now() - queryEndpointsStart
        });
      });

    const queryKeysStart = performance.now();
    const workspaceKeys = await database
      .select({count: count()})
      .from(schema.key)
      .where(eq(schema.key.workspaceId, workspace.id))
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'keys.count',
          latency: performance.now() - queryKeysStart
        });
      });

    if (!workspaceKeys[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server Internal Error'
      });
    }

    const queryMembersStart = performance.now();
    const members = await database.query.usersToWorkspaces
      .findMany({
        where: (table, {eq}) => eq(table.workspaceId, workspace.id),
        with: {user: true}
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'usersToWorkspaces.list',
          latency: performance.now() - queryMembersStart
        });
      });

    const billingCycle = calculatePlanCycleDates(workspace);

    const submissions = await ctx.analytics.queryFormizeeMonthlySubmissions(
      workspace.id,
      billingCycle.startDate,
      billingCycle.endDate
    );

    const apiDailyRequests = await ctx.analytics.queryFormizeeDailyRequests(
      workspace.id
    );

    let totalStorage = 0;
    await Promise.all(
      endpoints.map(async endpoint => {
        const {data, error} = await ctx.vault.storage.get({
          endpointId: endpoint.id
        });

        if (error) {
          return;
        }
        totalStorage += data.storageUsed;
      })
    );

    return {
      submissions,
      apiDailyRequests,
      members: members.length,
      endpoints: endpoints.length,
      keys: workspaceKeys[0].count,
      storage: Math.round(totalStorage / (1024 * 1024))
    };
  });
