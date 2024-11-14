import {database, schema, count, eq} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {getLimits} from '@formizee/plans';
import {TRPCError} from '@trpc/server';
import {newId} from '@formizee/id';
import {z} from 'zod';

export const createEndpoint = protectedProcedure
  .input(
    z.object({
      workspaceSlug: z.string(),
      name: z.string().max(64),
      slug: z.string().max(64),
      targetEmails: z.string().email().array()
    })
  )
  .mutation(async ({input, ctx}) => {
    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.slug, input.workspaceSlug)
    });

    if (!workspace) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found'
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
        message: 'You do not have permission to create in this workspace.'
      });
    }

    const limits = getLimits(workspace.plan);

    const workspaceEndpoints = await database
      .select({count: count()})
      .from(schema.endpoint)
      .where(eq(schema.endpoint.workspaceId, workspace.id));

    if (!workspaceEndpoints[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server Internal Error'
      });
    }

    if (
      typeof limits.endpoints === 'number' &&
      workspaceEndpoints[0].count >= limits.endpoints
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Upgrade for more endpoints'
      });
    }

    // Check Slug
    const slugExists = await database.query.endpoint.findFirst({
      where: (table, {and, eq}) =>
        and(eq(table.workspaceId, workspace.id), eq(table.slug, input.slug))
    });

    if (slugExists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Slug has to be unique and has already been taken'
      });
    }

    // Check target emails
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

    const data: schema.InsertEndpoint = {
      id: newId('endpoint'),
      workspaceId: workspace.id,

      slug: input.slug,
      name: input.name ?? input.slug,

      redirectUrl: 'https://formizee.com/thanks-you',
      targetEmails: input.targetEmails,

      icon: schema.endpointIcon[
        Math.floor(Math.random() * schema.endpointIcon.length)
      ],
      color:
        schema.endpointColor[
          Math.floor(Math.random() * schema.endpointColor.length)
        ]
    };

    await database.insert(schema.endpoint).values(data);

    // Ingest audit logs
    await ctx.analytics.ingestFormizeeAuditLogs({
      event: 'endpoint.create',
      workspaceId: workspace.id,
      actor: {
        type: 'user',
        id: ctx.user.id ?? 'Not available',
        name: ctx.user.name ?? 'Not available'
      },
      resources: [
        {
          id: data.id,
          type: 'endpoint'
        }
      ],
      description: `Created ${data.id}`,
      context: {
        location: ctx.audit.location,
        userAgent: ctx.audit.userAgent
      }
    });

    return {slug: data.slug};
  });
