import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const getUserEmails = protectedProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query(async ({input, ctx}) => {
    const queryUserStart = performance.now();
    const user = await database.query.user
      .findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'users.get',
          latency: performance.now() - queryUserStart
        });
      });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.'
      });
    }

    const queryEmailsStart = performance.now();
    const emails = await database.query.usersToEmails
      .findMany({
        where: (table, {eq}) => eq(table.userId, user.id)
      })
      .finally(() => {
        ctx.analytics.metrics.insertDatabase({
          type: 'read',
          query: 'usersToEmails.get',
          latency: performance.now() - queryEmailsStart
        });
      });

    return emails;
  });
