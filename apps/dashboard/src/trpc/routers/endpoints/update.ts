import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, eq, schema} from '@/lib/db';
import {z} from 'zod';

export const updateEndpoint = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
      icon: z.enum(schema.endpointIcon).optional(),
      color: z.enum(schema.endpointColor).optional(),
      targetEmails: z.string().email().array().optional()
    })
  )
  .mutation(async ({input, ctx}) => {
    const endpoint = await database.query.endpoint.findFirst({
      where: (table, {eq}) => eq(table.id, input.id)
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
        message: 'You do not have permission to view this workspace.'
      });
    }

    if (input.slug !== undefined) {
      const slugExists = await database.query.endpoint.findFirst({
        where: (table, {and, eq}) =>
          and(
            eq(table.workspaceId, workspace.id),
            eq(table.slug, input.slug ?? '')
          )
      });

      if (slugExists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Slug has to be unique and has already been taken'
        });
      }
    }

    if (input.targetEmails !== undefined) {
      const validTargetEmails = input.targetEmails.every(email =>
        workspace.availableEmails.includes(email)
      );
      if (!validTargetEmails) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'All the target emails needs to be available in the current workspace'
        });
      }
    }

    const updateEndpoint = await database
      .update(schema.endpoint)
      .set({
        name: input.name ?? endpoint.name,
        slug: input.slug ?? endpoint.slug,
        icon: input.icon ?? endpoint.icon,
        color: input.color ?? endpoint.color,
        targetEmails: input.targetEmails ?? endpoint.targetEmails
      })
      .where(eq(schema.endpoint.id, endpoint.id))
      .returning();

    if (!updateEndpoint[0]) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          "The endpoint can't be updated, please contact to support@formizee.com"
      });
    }

    return updateEndpoint[0];
  });
