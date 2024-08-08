import type {AppRouter} from './routers';
import {headers} from 'next/headers';
import superjson from 'superjson';

import {
  type HTTPBatchLinkOptions,
  type HTTPHeaders,
  type TRPCLink,
  createTRPCProxyClient,
  httpBatchLink
} from '@trpc/client';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  const vercel = process.env.VERCEL_URL;

  if (vercel) {
    return `https://${vercel}`;
  }

  return 'http://localhost:3001';
};

export const endingLink = (opts?: {
  headers?: HTTPHeaders | (() => HTTPHeaders);
}) =>
  (runtime => {
    const sharedOpts = {
      headers: opts?.headers
    } satisfies Partial<HTTPBatchLinkOptions>;

    const link = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc`
    })(runtime);

    return ctx => {
      const path = ctx.op.path.split('.') as [string, ...string[]];

      const newCtx = {
        ...ctx,
        op: {...ctx.op, path: path.join('.')}
      };
      return link(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    /*
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),*/
    endingLink({
      headers: () => {
        const h = new Map(headers());
        h.delete('connection');
        h.delete('transfer-encoding');
        h.set('x-trpc-source', 'server');
        return Object.fromEntries(h.entries());
      }
    })
  ]
});
