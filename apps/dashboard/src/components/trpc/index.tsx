'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {api} from '@/trpc/client';
import superjson from 'superjson';
import {useState} from 'react';
import {loggerLink} from '@trpc/client';
import {endingLink} from '@/trpc/shared';

export function TrpcProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
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
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
