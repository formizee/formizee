import {router} from '@/trpc';

// Routers
import {workspaceRouter} from './workspace';
import {endpointRouter} from './endpoints';
import {userRouter} from './user';
import {keyRouter} from './keys';

export const appRouter = router({
  workspace: workspaceRouter,
  endpoint: endpointRouter,
  user: userRouter,
  key: keyRouter
});

export type AppRouter = typeof appRouter;
