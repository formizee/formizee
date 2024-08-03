import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {appRouter} from '@/trpc/routers';

const handler = (request: Request) =>
  fetchRequestHandler({
    createContext: () => ({}),
    endpoint: '/api/trpc',
    router: appRouter,
    req: request
  });

export {handler as GET, handler as POST};
