import {router, protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database} from '@/lib/db';
import {z} from 'zod';

export const userRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({input}) => {
      const user = await database.query.user.findFirst({
        where: (table, {eq}) => eq(table.id, input.id)
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found.'
        });
      }

      return user;
    })
});
