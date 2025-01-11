import {database, eq, schema} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

const RESERVED_SLUGS = ['api', 'auth', 'billing', 'login', 'acme', 'formizee'];

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
    if (RESERVED_SLUGS.includes(input.slug)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `The slug "${input.slug}" is reserved and cannot be used.`
      });
    }

    const {workspace, error} = await authorize(
      {workspaceSlug: input.slug},
      ctx
    );

    if (!workspace) {
      throw error;
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
