import {SecretsProvider} from '@/lib/secrets';
import {Hono} from 'hono';

/* @ts-ignore-next-line */
import {sentry} from '@hono/sentry';

import authRouter from '@/routes/auth';
import profileRouter from '@/routes/profile';
import waitlistRouter from '@/routes/waitlist';
//import endpointsRouter from '@/routes/endpoints';
//import submissionsRouter from '@/routessubmissions';

export type Env = {
  DB: D1Database;
  WORKER_ENV: string;
  SMTP_SECRET: string;
  SESSION_SECRET: string;
};

const router = new Hono<{Bindings: Env}>().basePath('/api');

router.use('*', sentry())

router.route('/auth', authRouter);
router.route('/profile', profileRouter);
router.route('/waitlist', waitlistRouter);
//router.route('/endpoints', endpointsRouter);
//router.route('/submissions', submissionsRouter);

router.get('/status', async context => context.json('OK', 200));

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) => {
    SecretsProvider.getInstance().setSmtp(env.SMTP_SECRET);
    SecretsProvider.getInstance().setDb(env.DB);
    return router.fetch(request, env, context);
  }
};
