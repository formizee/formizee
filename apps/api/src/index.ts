import {DatabaseProvider} from '@/lib/db';
import {Hono} from 'hono';

import apiRouter from '@/routes/api';
import authRouter from '@/routes/auth';

export type Env = {
  DB: D1Database;
  SESSION_SECRET: string;
};

const router = new Hono<{Bindings: Env}>();

router.route('/api', apiRouter);
router.route('/auth', authRouter);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    DatabaseProvider.getInstance().setDb(env.DB);
    return router.fetch(request, env, ctx);
  }
};
