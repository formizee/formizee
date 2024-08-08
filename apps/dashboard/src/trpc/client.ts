import {createTRPCProxyClient, loggerLink} from '@trpc/client';
import type {AppRouter} from './routers';
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
      headers: {
        'x-trpc-source': 'client'
      }
    })
  ]
});
