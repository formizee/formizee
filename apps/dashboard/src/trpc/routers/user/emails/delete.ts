import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {and, database, eq, schema} from '@/lib/db';
import {z} from 'zod';

export const deleteLinkedEmail = protectedProcedure
  .input(
    z.object({
      email: z.string().email()
    })
  )
  .mutation(async ({input, ctx}) => {
    const queryUserStart = performance.now();
    const user = await database.query.user
      .findFirst({
        where: (table, {eq}) => eq(table.id, ctx.user?.id ?? '')
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
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

    const queryEmailStart = performance.now();
    const email = await database.query.usersToEmails
      .findFirst({
        where: (table, {and, eq}) =>
          and(eq(table.userId, user.id), eq(table.email, input.email))
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'usersToEmails.get',
          latency: performance.now() - queryEmailStart
        });
      });

    if (!email) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Linked email not found.'
      });
    }

    if (email.email === user.email) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "You canno't delete the primary email."
      });
    }

    if (email.isVerified) {
      const queryWorkspacesStart = performance.now();
      const workspaces = await database.query.usersToWorkspaces
        .findMany({
          where: (table, {eq}) => eq(table.userId, user.id),
          with: {
            workspace: true
          }
        })
        .finally(() => {
          ctx.metrics.emit({
            metric: 'main.db.read',
            query: 'usersToWorkspaces.list',
            latency: performance.now() - queryWorkspacesStart
          });
        });

      for (const workspace of workspaces) {
        const availableEmails = workspace.workspace.availableEmails.filter(
          item => item !== input.email
        );

        const mutateWorkspaceStart = performance.now();
        await database
          .update(schema.workspace)
          .set({availableEmails})
          .where(eq(schema.workspace.id, workspace.workspaceId))
          .finally(() => {
            ctx.metrics.emit({
              metric: 'main.db.write',
              mutation: 'workspaces.put',
              latency: performance.now() - mutateWorkspaceStart
            });
          });
      }
    }

    const mutateEmailStart = performance.now();
    await database
      .delete(schema.usersToEmails)
      .where(
        and(
          eq(schema.usersToEmails.userId, user.id),
          eq(schema.usersToEmails.email, input.email)
        )
      )
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.write',
          mutation: 'usersToEmails.delete',
          latency: performance.now() - mutateEmailStart
        });
      });
  });
