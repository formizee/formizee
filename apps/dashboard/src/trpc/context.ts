import type {FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import type {inferAsyncReturnType} from '@trpc/server';
import {auth} from '@/lib/auth';
import {Analytics} from '@formizee/analytics';
import {Vault} from '@formizee/vault';
import {env} from '@/lib/enviroment';

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
    analytics: new Analytics({
      tinybirdToken:
        env().VERCEL_ENV === 'development' ? env().TINYBIRD_TOKEN : undefined,
      tinybirdUrl: env().TINYBIRD_URL
    }),
    vault: new Vault({
      url: env().VAULT_URL,
      token: env().VAULT_SECRET
    }),
    user: session?.user ?? null
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
