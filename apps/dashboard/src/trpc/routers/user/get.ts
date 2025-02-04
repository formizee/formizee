import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const getUser = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const queryStart = performance.now();
    const user = await database.query.user
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'users.get',
          latency: performance.now() - queryStart
        });
      });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.'
      });
    }

    return user;
  });
