import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const listSubmissions = protectedProcedure
  .input(
    z.object({
      endpointId: z.string()
    })
  )
  .query(async ({input, ctx}) => {
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
        message: 'You do not have permission to view this endpoint.'
      });
    }

    const {data, error} = await ctx.vault.submissions.list({
      endpointId: endpoint.id
    });

    if (error) {
      return {
        columns: [],
        submissions: []
      };
    }

    const submissions = data.submissions.map(
      (submission: {id: string; data: object}) => ({
        id: submission.id,
        ...submission.data
      })
    );

    const baseColumns = [
      {
        id: 'formizee_internal_id',
        accessorKey: 'id',
        header: 'ID'
      }
    ];

    const schemaColumns = Object.keys(data._metadata.schema).map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1)
    }));

    const columns = [...baseColumns, ...schemaColumns];

    return {
      columns,
      submissions
    };
  });
