import {initTRPC, TRPCError} from '@trpc/server';
import type {Context} from './context';
import transformer from 'superjson';

const t = initTRPC.context<Context>().create({transformer});

export const auth = t.middleware(({next, ctx}) => {
  if (!ctx.user?.id) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }

  return next({
    ctx: {
      user: ctx.user
    }
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(auth);
