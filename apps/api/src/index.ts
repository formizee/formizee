import {SecretsProvider} from '@/lib/secrets';
import {Hono} from 'hono';

import apiRouter from '@/routes/api';
import authRouter from '@/routes/auth';

export type Env = {
  DB: D1Database;
  SMTP_SECRET: string;
  SESSION_SECRET: string;
};

const router = new Hono<{Bindings: Env}>();

router.route('/api', apiRouter);
router.route('/auth', authRouter);

const routerFetch = (request: Request, env: Env, ctx: ExecutionContext) => {
  SecretsProvider.getInstance().setSmtp(env.SMTP_SECRET);
  SecretsProvider.getInstance().setDb(env.DB);
  return router.fetch(request, env, ctx);
}

export default {
  port: 4000,
  fetch: routerFetch
};
