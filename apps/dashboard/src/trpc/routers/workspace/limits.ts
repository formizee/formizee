import {calculatePlanCycleDates} from '@formizee/plans';
import {count, database, eq, schema} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

export const getWorkspaceLimits = protectedProcedure
  .input(
    z.object({
      slug: z.string().max(64)
    })
  )
  .query(async ({input, ctx}) => {
    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.slug, input.slug)
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

    const endpoints = await database.query.endpoint.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id)
    });

    const workspaceKeys = await database
      .select({count: count()})
      .from(schema.key)
      .where(eq(schema.key.workspaceId, workspace.id));

    if (!workspaceKeys[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server Internal Error'
      });
    }

    const members = await database.query.usersToWorkspaces.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id),
      with: {user: true}
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
    Promise.all(
      endpoints.map(async endpoint => {
        const {data} = await ctx.vault.storage.get({endpointId: endpoint.id});
        totalStorage += data?.storageUsed ?? 0;
      })
    );

    return {
      submissions,
      apiDailyRequests,
      storage: totalStorage,
      endpoints: endpoints.length,
      keys: workspaceKeys[0].count,
      members: members.length
    };
  });
