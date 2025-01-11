import {protectedProcedure} from '@/trpc';
import {authorize} from '@/trpc/utils';
import {z} from 'zod';

export const getWorkspaceBySlug = protectedProcedure
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

    return workspace;
  });
