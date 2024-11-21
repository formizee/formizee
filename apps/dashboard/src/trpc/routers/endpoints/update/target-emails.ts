import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';

export const updateEndpointTargetEmails = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      targetEmails: z.string().email().array()
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

    const validTargetEmails = input.targetEmails.every(email =>
      workspace.availableEmails.includes(email)
    );
    if (!validTargetEmails) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'All the target emails needs to be available in the current workspace'
      });
    }

    try {
      const updatedEndpoint = await database
        .update(schema.endpoint)
        .set({targetEmails: input.targetEmails ?? endpoint.targetEmails})
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
        description: `Updated ${endpoint.id} target emails`,
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
