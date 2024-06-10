import {Hono} from 'hono';
import {timeout} from 'hono/timeout';
import {logger} from '@/lib/logger';
import {server} from '@/lib/server';
import {waitlist} from '@/routes/waitlist';
import {endpoints} from './routes/endpoints';

const router = new Hono().basePath('/v1');
router.use(timeout(30 * 1000));
router.use(logger);

router.route('/waitlist', waitlist);
router.route('/endpoints', endpoints);

router.get('/status', context => context.text('OK', 200));

server(router);
