import {type ExecutionContext, Hono} from 'hono';
import {SecretsProvider} from '@/lib/secrets';
import {reportError} from '@/lib/logger';
import authRouter from '@/routes/auth';
import profileRouter from '@/routes/profile';
import waitlistRouter from '@/routes/waitlist';
import type {Env} from './types';
//import endpointsRouter from '@/routes/endpoints';
//import submissionsRouter from '@/routessubmissions';

const router = new Hono<{Bindings: Env}>().basePath('/api');

router.route('/auth', authRouter);
router.route('/profile', profileRouter);
router.route('/waitlist', waitlistRouter);
//router.route('/endpoints', endpointsRouter);
//router.route('/submissions', submissionsRouter);

router.get('/status', context => context.json('OK', 200));

router.onError(reportError);

export default {
  fetch: (request: Request, env: Env, context: ExecutionContext) => {
    SecretsProvider.getInstance().setSmtp(env.SMTP_SECRET);
    SecretsProvider.getInstance().setDb(env.DB);
    return router.fetch(request, env, context);
  }
};
