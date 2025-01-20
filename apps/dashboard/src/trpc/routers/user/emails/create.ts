import {protectedProcedure} from '@/trpc';
import {TRPCError} from '@trpc/server';
import {database, schema} from '@/lib/db';
import {z} from 'zod';
import {EmailService} from '@formizee/email';
import {env} from '@/lib/enviroment';
import {sign} from 'jsonwebtoken';

export const addLinkedEmail = protectedProcedure
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
    const emailAlreadyExists = await database.query.usersToEmails
      .findFirst({
        where: (table, {eq}) => eq(table.email, input.email)
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.read',
          query: 'usersToEmails.get',
          latency: performance.now() - queryEmailStart
        });
      });

    if (emailAlreadyExists?.userId === user.id) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'This email is already added to your linked emails.'
      });
    }

    if (emailAlreadyExists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'This email already exists inside Formizee.'
      });
    }

    const mutationStart = performance.now();
    await database
      .insert(schema.usersToEmails)
      .values({
        email: input.email,
        isVerified: false,
        userId: user.id
      })
      .finally(() => {
        ctx.metrics.emit({
          metric: 'main.db.write',
          mutation: 'usersToEmails.post',
          latency: performance.now() - mutationStart
        });
      });

    const payload = {email: input.email, userId: user.id};
    const token = sign(payload, env().AUTH_SECRET, {expiresIn: '1h'});
    const magicLink = `${env().DASHBOARD_URL}/api/linked-emails/verify?token=${token}`;

    const emailService = new EmailService({
      accessKey: env().AWS_SES_ACCESS_KEY,
      secretAccesKey: env().AWS_SES_SECRET_ACCESS_KEY
    });
    await emailService.sendVerifyLinkedEmail({
      email: input.email,
      magicLink
    });
  });
