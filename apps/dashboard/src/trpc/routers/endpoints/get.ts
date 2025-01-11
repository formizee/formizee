import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const getEndpointBySlug = protectedProcedure
  .input(
    z.object({
      endpointSlug: z.string(),
      workspaceSlug: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const {workspace, error} = await authorize(input, ctx);

    if (!workspace) {
      throw error;
    }

    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {and, eq}) =>
        and(
          eq(table.slug, input.endpointSlug),
          eq(table.workspaceId, workspace.id)
        )
    });

    if (!endpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Endpoint not found.'
      });
    }

    return endpoint;
  });
