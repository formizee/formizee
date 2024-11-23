import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';

export const updateEndpointSlug = protectedProcedure
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

    const slugAlreadyTaken = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.slug, input.slug)
    });

    if (slugAlreadyTaken) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Slug has to be unique and has already been taken'
      });
    }

    try {
      const updatedEndpoint = await database
        .update(schema.endpoint)
        .set({slug: input.slug ?? endpoint.slug})
        .where(eq(schema.endpoint.id, endpoint.id))
        .returning();

      // Ingest audit logs
      await ctx.analytics.ingestFormizeeAuditLogs({
        event: 'endpoint.update',
        workspaceId: workspace.id,
        actor: {
          type: 'user',
          id: ctx.user.id ?? 'Not available',
          name: ctx.user.name ?? 'Not available'
        },
        resources: [
          {
            id: endpoint.id,
            type: 'endpoint'
          }
        ],
        description: `Updated ${endpoint.id} slug to ${input.slug}`,
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent
        }
      });

      return updatedEndpoint[0];
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The endpoint can't be updated, please contact to support@formizee.com"
      });
    }
  });
