import { Hono } from 'hono'

import {usersRouter} from '@/routes/users';

const router = new Hono()

router.route('/users', usersRouter);

export default router;
