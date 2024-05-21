import { Hono } from 'hono'

import {usersRouter} from '@/routes/users';
import { DatabaseConfigProvider } from '@/lib/database';

export type Env = {
  DB: D1Database;
}

const router = new Hono<{Bindings: Env}>();

router.route('/users', usersRouter);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const configProvider = DatabaseConfigProvider.getInstance();
    configProvider.setDb(env.DB);

    return router.fetch(request, env, ctx)
  },
}
