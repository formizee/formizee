import {database, schema, count, eq} from '@/lib/db';
import {getLimits} from '@formizee/plans';
import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {KeyService, newKey} from '@formizee/keys';
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

    const workspaceKeys = await database
      .select({count: count()})
      .from(schema.key)
      .where(eq(schema.key.workspaceId, workspace.id));

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

    await database.insert(schema.key).values(data);

    // Ingest audit logs
    await ctx.analytics.ingestFormizeeAuditLogs({
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
