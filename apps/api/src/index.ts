import {SecretsProvider} from '@/lib/secrets';
import {Hono} from 'hono';

//import submissionsRouter from '@/routessubmissions';
//import endpointsRouter from '@/routes/endpoints';
//import profileRouter from '@/routes/profile';
import waitlistRouter from '@/routes/waitlist';
import authRouter from '@/routes/auth';

export type Env = {
  DB: D1Database;
  WORKER_ENV: string;
  SMTP_SECRET: string;
  SESSION_SECRET: string;
};

const router = new Hono<{Bindings: Env}>().basePath('/api');

router.get('/status', async context => context.json('OK', 200));
//apiRouter.route('/submissions', submissionsRouter);
//apiRouter.route('/endpoints', endpointsRouter);
//apiRouter.route('/profile', profileRouter);
router.route('/waitlist', waitlistRouter);
router.route('/auth', authRouter);


export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    SecretsProvider.getInstance().setSmtp(env.SMTP_SECRET);
    SecretsProvider.getInstance().setDb(env.DB);
    return router.fetch(request, env, ctx);
  }
};
