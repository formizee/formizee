import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {z} from 'zod';

export const listLogs = protectedProcedure
  .input(
    z.object({
      workspaceSlug: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const {workspace, error} = await authorize(input, ctx);

    if (!workspace) {
      throw error;
    }

    const response = await ctx.analytics.queryFormizeeAuditLogs(workspace.id);
    return response;
  });
