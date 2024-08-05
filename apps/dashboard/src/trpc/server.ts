import {initTRPC, TRPCError} from '@trpc/server';
import type {Context} from './context';
import transformer from 'superjson';

export const trpcServer = initTRPC.context<Context>().create({transformer});

export const router = trpcServer.router;
export const publicProcedure = trpcServer.procedure;

export const auth = trpcServer.middleware(({next, ctx}) => {
  if (!ctx.user?.id) {
    throw new TRPCError({code: 'UNAUTHORIZED'});
  }

  return next({
    ctx: {
      user: ctx.user
    }
  });
});

export {TRPCError};
