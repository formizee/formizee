import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';
import {authorize} from '@/trpc/utils';

export const listSubmissions = protectedProcedure
  .input(
    z.object({
      endpointId: z.string(),
      pageSize: z.number(),
      pageIndex: z.number()
    })
  )
  .query(async ({input, ctx}) => {
    const queryStart = performance.now();
    const endpoint = await database.query.endpoint
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.endpointId)
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'endpoints.get',
          latency: performance.now() - queryStart
        });
      });

    if (!endpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Endpoint not found.'
      });
    }

    const authorized = await authorize({id: endpoint.workspaceId}, ctx);

    if (!authorized.workspace) {
      throw authorized.error;
    }

    const {data, error} = await ctx.vault.submissions.list({
      limit: input.pageSize,
      endpointId: endpoint.id,
      page: input.pageIndex
    });

    if (error) {
      return {
        columns: [],
        submissions: []
      };
    }

    const submissions = data.submissions.map(
      (submission: {id: string; endpointId: string; data: object}) => ({
        endpointId: submission.endpointId,
        id: submission.id,
        ...submission.data
      })
    );

    const pageCount = data._metadata.totalPages;
    const pageSize = data._metadata.itemsPerPage;

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
      pageSize,
      pageCount,
      submissions
    };
  });
