import { DatabaseConfigProvider } from '@/lib/database';
import { Hono } from 'hono'

import apiRouter from '@/routes/api';
import authRouter from '@/routes/auth';

export type Env = {
  DB: D1Database;
  SESSION_SECRET: string;
}

const router = new Hono<{Bindings: Env}>();


router.route('/api', apiRouter);
router.route('/auth', authRouter);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const configProvider = DatabaseConfigProvider.getInstance();
    configProvider.setDb(env.DB);

    return router.fetch(request, env, ctx)
  },
}
