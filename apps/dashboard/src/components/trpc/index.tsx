'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {httpBatchLink} from '@trpc/react-query';
import transformer from 'superjson';
import {trpc} from '@/trpc/client';
import {useState} from 'react';

interface Props {
  children: React.ReactNode;
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // browser should use relative path
    return '';
  }

  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const TRPCProvider = ({children}: Props) => {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ],
      transformer
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
