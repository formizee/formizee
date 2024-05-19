import { Hono } from 'hono'

import {usersRouter} from '@/routes/users';

export type Env = {
  DB: D1Database;
}

const router = new Hono<{Bindings: Env}>();

router.route('/users', usersRouter);

export default router;
