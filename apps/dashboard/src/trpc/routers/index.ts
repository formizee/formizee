import {router} from '@/trpc';

// Routers
import {workspaceRouter} from './workspace';
import {endpointRouter} from './endpoints';
import {userRouter} from './user';

export const appRouter = router({
  workspace: workspaceRouter,
  endpoint: endpointRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;
