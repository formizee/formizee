import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const listEndpoints = protectedProcedure

  .input(
    z.object({
      workspaceSlug: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const workspace = await database.query.workspace.findFirst({
      where: (table, {eq}) => eq(table.slug, input.workspaceSlug)
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

    const endpoints = await database.query.endpoint.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id),
      orderBy: (endpoints, {asc}) => [asc(endpoints.createdAt)]
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
