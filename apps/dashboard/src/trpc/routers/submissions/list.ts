import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';
import {env} from '@/lib/enviroment';

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

    const response = await fetch('https://vault.formizee.com/v1/submissions', {
      method: 'POST',
      headers: {
        Authorization: env().VAULT_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({endpointId: endpoint.id})
    });

    if (response.status !== 200) {
      return {
        columns: [],
        submissions: []
      };
    }

    const result = await response.json();

    const submissions = result.submissions.map(
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

    const schemaColumns = Object.keys(result._metadata.schema).map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1)
    }));

    const columns = [...baseColumns, ...schemaColumns];

    return {
      columns,
      submissions
    };
  });
