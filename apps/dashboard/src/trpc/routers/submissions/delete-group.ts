import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const deleteSubmissionGroup = protectedProcedure
  .input(
    z.object({
      submissions: z.string().array(),
      endpointId: z.string()
    })
  )
  .mutation(async ({input, ctx}) => {
    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, input.endpointId)
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

    const deletedSubmissions = await Promise.all(
      input.submissions.map(async id => {
        const {error} = await ctx.vault.submissions.delete({
          endpointId: endpoint.id,
          id
        });
        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message:
              "The submission can't be deleted, please contact support@formizee.com"
          });
        }
      })
    );

    return deletedSubmissions;
  });
