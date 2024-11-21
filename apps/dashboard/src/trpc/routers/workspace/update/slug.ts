import {database, eq, schema} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

export const updateWorkspaceSlug = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      slug: z
        .string()
        .min(4, {message: 'The slug must be between 4 and 64 characters long.'})
        .max(64, {
          message: 'The slug must be between 4 and 64 characters long.'
        })
        .regex(/^[a-z0-9.-]+$/, {
          message:
            'The slug must contain only lowercase letters, numbers adn hyphens, with no space or special characters.'
        })
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

    const slugAlreadyTaken = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.slug, input.slug)
    });

    if (slugAlreadyTaken) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Slug has to be unique and has already been taken'
      });
    }

    try {
      const updatedWorkspace = await database
        .update(schema.workspace)
        .set({slug: input.slug ?? workspace.slug})
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
        description: `Updated workspace slug to ${input.slug}`,
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
