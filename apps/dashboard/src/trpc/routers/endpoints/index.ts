import {trpcServer} from '@/trpc/server';
import {listEndpoints} from './list';

export const endpointRouter = trpcServer.router({
  list: listEndpoints
});
