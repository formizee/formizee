import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const updateEndpointRedirectUrl = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      redirectUrl: z.string().url()
    })
  )
  .mutation(async ({input, ctx}) => {
    const endpointQueryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'endpoints.get',
          latency: performance.now() - endpointQueryStart
        });
      });

    if (!endpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Endpoint not found.'
      });
    }

    const {workspace, error} = await authorize({id: endpoint.workspaceId}, ctx);

    if (!workspace) {
      throw error;
    }

    try {
      const mutationStart = performance.now();
      const updatedEndpoint = await database
        .update(schema.endpoint)
        .set({redirectUrl: input.redirectUrl ?? endpoint.redirectUrl})
        .where(eq(schema.endpoint.id, endpoint.id))
        .returning()
        .finally(() => {
          ctx.analytics.metrics.insertDatabase({
            type: 'write',
            query: 'endpoints.put',
            latency: performance.now() - mutationStart
          });
        });

      // Ingest audit logs
      await ctx.analytics.auditLogs.insert({
        time: Date.now(),
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
        description: `Updated ${endpoint.id} redirect url to ${input.redirectUrl}`,
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
