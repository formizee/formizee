import {database, schema, count, eq} from '@/lib/db';
import {protectedProcedure} from '@/trpc';
import {getLimits} from '@formizee/plans';
import {TRPCError} from '@trpc/server';
import {newId} from '@formizee/id';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const createEndpoint = protectedProcedure
  .input(
    z.object({
      workspaceSlug: z.string(),
      name: z.string().max(64),
      slug: z.string().max(64)
    })
  )
  .mutation(async ({input, ctx}) => {
    const {workspace, error} = await authorize(input, ctx);

    if (!workspace) {
      throw error;
    }

    const limits = getLimits(workspace.plan);

    const countQueryStart = performance.now();
    const workspaceEndpoints = await database
      .select({count: count()})
      .from(schema.endpoint)
      .where(eq(schema.endpoint.workspaceId, workspace.id))
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.count',
          latency: performance.now() - countQueryStart
        });
      });

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
    const endpointQueryStart = performance.now();
    const slugExists = await database.query.endpoint
      .findFirst({
        where: (table, {and, eq}) =>
          and(eq(table.workspaceId, workspace.id), eq(table.slug, input.slug))
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - endpointQueryStart
        });
      });

    if (slugExists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Slug has to be unique and has already been taken'
      });
    }

    // Get user email
    const user = await database.query.user.findFirst({
      where: (table, {eq}) => eq(table.id, ctx.user.id ?? '')
    });

    if (!user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'The user does not exists'
      });
    }

    const data: schema.InsertEndpoint = {
      id: newId('endpoint'),
      workspaceId: workspace.id,

      slug: input.slug,
      name: input.name ?? input.slug,

      redirectUrl: 'https://formizee.com/f/thanks-you',
      targetEmails: [user.email],

      icon: schema.endpointIcon[
        Math.floor(Math.random() * schema.endpointIcon.length)
      ],
      color:
        schema.endpointColor[
          Math.floor(Math.random() * schema.endpointColor.length)
        ]
    };

    const mutationStart = performance.now();
    await database
      .insert(schema.endpoint)
      .values(data)
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.write',
          mutation: 'endpoints.post',
          latency: performance.now() - mutationStart
        });
      });

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
