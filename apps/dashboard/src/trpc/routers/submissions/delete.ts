import {database, eq, schema} from '@/lib/db';
import {env} from '@/lib/enviroment';
import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {z} from 'zod';

export const deleteSubmission = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .mutation(async ({input, ctx}) => {
    const submission = await database.query.submission.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (!submission) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Submission not found.'
      });
    }

    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, submission.endpointId)
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

    await fetch(
      `https://vault.formizee.com/v1/submission/${endpoint.id}/${submission.id}`,
      {
        headers: {Authorization: env().VAULT_SECRET},
        method: 'DELETE'
      }
    );

    const deletedSubmission = await database
      .delete(schema.submission)
      .where(eq(schema.submission.id, submission.id))
      .returning();

    if (!deletedSubmission[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The submission can't be deleted, please contact to support@formizee.com"
      });
    }

    return {id: deletedSubmission[0].id};
  });
