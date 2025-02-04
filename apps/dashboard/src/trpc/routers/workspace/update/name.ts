import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const updateWorkspaceName = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional()
    })
  )
  .mutation(async ({input, ctx}) => {
    const {workspace, error} = await authorize(input, ctx);

    if (!workspace) {
      throw error;
    }

    try {
      const mutationStart = performance.now();
      const updatedWorkspace = await database
        .update(schema.workspace)
        .set({
          name: input.name ?? workspace.name
        })
        .where(eq(schema.workspace.id, workspace.id))
        .returning()
        .finally(() => {
          ctx.analytics.metrics.insertDatabase({
            type: 'write',
            query: 'workspaces.put',
            latency: performance.now() - mutationStart
          });
        });

      // Ingest audit logs
      await ctx.analytics.auditLogs.insert({
        event: 'workspace.update',
        workspaceId: workspace.id,
        actor: {
          type: 'user',
          id: ctx.user.id ?? 'Not available',
          name: ctx.user.name ?? 'Not available'
        },
        resources: [
          {
            id: workspace.id,
            type: 'workspace'
          }
        ],
        description: `Updated workspace name to ${input.name}`,
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent
        }
      });

      return updatedWorkspace[0];
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The workspace can't be updated, please contact to support@formizee.com"
      });
    }
  });
