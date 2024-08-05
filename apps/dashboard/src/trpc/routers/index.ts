import {endpointRouter} from './endpoints';
import {trpcServer} from '../server';

export const appRouter = trpcServer.router({
  endpoint: endpointRouter
});

export type AppRouter = typeof appRouter;
