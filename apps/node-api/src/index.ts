import {Hono} from 'hono';
import {logger} from '@/lib/logger';
import {server} from '@/lib/server';
import {waitlist} from '@/routes/waitlist';

const router = new Hono().basePath('/v1');
router.use(logger);

router.get('/status', context => context.text('OK', 200));
router.route('/waitlist', waitlist);

server(router);
