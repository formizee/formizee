import { Hono } from "hono";

import submissionsRouter from './submissions';
import endpointsRouter from './endpoints';
import profileRouter from './profile';

export const apiRouter = new Hono();

apiRouter.get('/status', async context => {
  return context.json("OK", 200);
})

apiRouter.route('/submissions', submissionsRouter);
apiRouter.route('/endpoints', endpointsRouter);
apiRouter.route('/profile', profileRouter);

export default apiRouter;
