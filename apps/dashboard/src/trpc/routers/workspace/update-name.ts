import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';

export const updateWorkspaceName = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional()
    })
  )
  .mutation(async ({input, ctx}) => {
    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
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
          eq(table.userId, ctx.user?.id ?? ''),
          eq(table.workspaceId, workspace.id)
        )
    });

    if (!authorized || authorized.role !== 'owner') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to update this workspace.'
      });
    }

    try {
      const updatedWorkspace = await database
        .update(schema.workspace)
        .set({
          name: input.name ?? workspace.name
        })
        .where(eq(schema.workspace.id, workspace.id))
        .returning();

      // Ingest audit logs
      await ctx.analytics.ingestFormizeeAuditLogs({
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
