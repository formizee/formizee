import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {database} from '@/lib/db';
import {z} from 'zod';

export const getWorkspaceMembers = protectedProcedure
  .input(
    z.object({
      slug: z.string().max(64)
    })
  )
  .query(async ({input, ctx}) => {
    const {workspace, error} = await authorize(
      {workspaceSlug: input.slug},
      ctx
    );

    if (!workspace) {
      throw error;
    }

    const queryStart = performance.now();
    const members = await database.query.usersToWorkspaces
      .findMany({
        where: (table, {eq}) => eq(table.workspaceId, workspace.id),
        with: {user: true}
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'usersToWorkspaces.list',
          latency: performance.now() - queryStart
        });
      });

    return members;
  });
