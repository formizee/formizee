import type {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import type {inferAsyncReturnType} from '@trpc/server';
import {auth} from '@/lib/auth';

export async function createContext({req}: FetchCreateContextFnOptions) {
  const session = await auth();

  return {
    req,
    audit: {
      userAgent: req.headers.get('user-agent') ?? undefined,
      location:
        req.headers.get('x-forwarded-for') ??
        process.env.VERCEL_REGION ??
        'unknown'
    },
    user: session?.user ?? null
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
