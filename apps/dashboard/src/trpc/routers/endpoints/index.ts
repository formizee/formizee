import {router, protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const endpointRouter = router({
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({input, ctx}) => {
      const endpoint = await database.query.endpoint.findFirst({
        where: (table, {eq}) => eq(table.slug, input.slug)
      });

      if (!endpoint) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Endpoint not found.'
        });
      }

      const workspace = await database.query.usersToWorkspaces.findFirst({
        where: (table, {and, eq}) =>
          and(
            eq(table.userId, ctx.user.id ?? ''),
            eq(table.workspaceId, endpoint.workspaceId)
          )
      });

      if (!workspace) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to view this workspace.'
        });
      }

      return endpoint;
    }),
  list: protectedProcedure
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
        where: (table, {eq}) => eq(table.workspaceId, workspace.id)
      });

      if (!endpoints) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Endpoints not found.'
        });
      }

      return endpoints;
    })
});
