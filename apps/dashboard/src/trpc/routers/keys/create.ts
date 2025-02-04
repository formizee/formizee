import {database, schema, count, eq} from '@/lib/db';
import {KeyService, newKey} from '@formizee/keys';
import {getLimits} from '@formizee/plans';
import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

export const createKey = protectedProcedure
  .input(
    z.object({
      name: z.string().max(64),
      workspaceSlug: z.string(),
      expiresAt: z.enum(schema.apiKeyExpirationDate)
    })
  )
  .mutation(async ({input, ctx}) => {
    const {workspace, error} = await authorize(input, ctx);

    if (!workspace) {
      throw error;
    }

    const limits = getLimits(workspace.plan);

    const queryStart = performance.now();
    const workspaceKeys = await database
      .select({count: count()})
      .from(schema.key)
      .where(eq(schema.key.workspaceId, workspace.id))
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'keys.count',
          latency: performance.now() - queryStart
        });
      });

    if (!workspaceKeys[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server Internal Error'
      });
    }

    if (
      typeof limits.keys === 'number' &&
      workspaceKeys[0].count >= limits.keys
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Upgrade for more keys'
      });
    }

    const {key, hash} = await newKey();
    const expiresAt = KeyService.generateExpiracyDate(input.expiresAt);

    const data: schema.InsertKey = {
      hash,
      id: key,
      expiresAt,
      name: input.name,
      workspaceId: workspace.id
    };

    const mutationStart = performance.now();
    await database
      .insert(schema.key)
      .values(data)
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'write',
          query: 'keys.post',
          latency: performance.now() - mutationStart
        });
      });

    // Ingest audit logs
    await ctx.analytics.auditLogs.insert({
      time: Date.now(),
      event: 'key.create',
      workspaceId: workspace.id,
      actor: {
        type: 'user',
        id: ctx.user.id ?? 'Not available',
        name: ctx.user.name ?? 'Not available'
      },
      resources: [
        {
          id: data.id,
          type: 'key'
        }
      ],
      description: `Created ${data.id}`,
      context: {
        location: ctx.audit.location,
        userAgent: ctx.audit.userAgent
      }
    });

    return data;
  });
