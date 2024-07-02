import {OpenAPIHono} from '@hono/zod-openapi';
import {timeout} from 'hono/timeout';
import {openApi} from '@/lib/openapi';
import {logger} from '@/lib/logger';
import {server} from '@/lib/server';
import {auth} from '@/routes/auth';
import {teams} from '@/routes/teams';
import {profile} from '@/routes/profile';
import {waitlist} from '@/routes/waitlist';
import {endpoints} from '@/routes/endpoints';
import {submissions} from '@/routes/submissions';

const router = new Hono().basePath('/v1');
const router = new OpenAPIHono().basePath('/v1');
openApi(router);

router.use(timeout(30 * 1000));
router.use(logger);

router.route('/auth', auth);
router.route('/teams', teams);
router.route('/profile', profile);
router.route('/waitlist', waitlist);
router.route('/endpoints', endpoints);
router.route('/submissions', submissions);

router.get('/status', context => context.text('OK', 200));

server(router);
