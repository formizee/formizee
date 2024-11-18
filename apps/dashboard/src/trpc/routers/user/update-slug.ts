import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';

export const updateUserSlug = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      slug: z.string().optional()
    })
  )
  .mutation(async ({input}) => {
    const user = await database.query.user.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.'
      });
    }

    if (input.slug !== undefined) {
      const slugExists = await database.query.user.findFirst({
        where: (table, {eq}) => eq(table.slug, input.slug ?? '')
      });

      if (slugExists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Slug has to be unique and has already been taken'
        });
      }
    }

    const updateUser = await database
      .update(schema.user)
      .set({
        slug: input.slug ?? user.slug
      })
      .where(eq(schema.user.id, user.id))
      .returning();

    if (!updateUser[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The user can't be updated, please contact to support@formizee.com"
      });
    }

    return updateUser[0];
  });
