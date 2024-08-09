import {createTRPCProxyClient, loggerLink} from '@trpc/client';
import type {AppRouter} from './routers';
import {headers} from 'next/headers';
import {endingLink} from './shared';
import superjson from 'superjson';

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: opts =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error)
    }),
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
