import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const listEndpoints = protectedProcedure

  .input(
    z.object({
      workspaceSlug: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const {workspace, error} = await authorize(input, ctx);

    if (!workspace) {
      throw error;
    }

    const queryStart = performance.now();
    const endpoints = await database.query.endpoint
      .findMany({
        where: (table, {eq}) => eq(table.workspaceId, workspace.id),
        orderBy: (endpoints, {asc}) => [asc(endpoints.createdAt)]
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.list',
          latency: performance.now() - queryStart
        });
      });

    if (!endpoints) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Endpoints not found.'
      });
    }

    const response = endpoints.map(endpoint => {
      return {
        id: endpoint.id,
        name: endpoint.name,
        slug: endpoint.slug,
        icon: endpoint.icon,
        color: endpoint.color
      };
    });

    return response;
  });
