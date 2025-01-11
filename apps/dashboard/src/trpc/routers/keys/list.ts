import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {database} from '@/lib/db';
import {z} from 'zod';

export const listKeys = protectedProcedure
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

    const data = await database.query.key.findMany({
      where: (table, {eq}) => eq(table.workspaceId, workspace.id)
    });

    const keys = data.map(key => {
      const lastAccess =
        key.lastAccess.getTime() === key.createdAt.getTime()
          ? 'Never'
          : key.lastAccess;

      const expiresAt =
        key.expiresAt.getFullYear() > 4000 ? 'Never' : key.expiresAt;

      return {...key, lastAccess, expiresAt};
    });

    return keys;
  });
