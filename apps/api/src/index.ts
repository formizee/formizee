import {OpenAPIHono} from '@hono/zod-openapi';
import {security} from '@/lib/middlewares';
import {openApi} from '@/lib/openapi';
import {server} from '@/lib/server';
import {auth} from '@/routes/auth';
import {teams} from '@/routes/teams';
import {health} from '@/routes/health';
import {profile} from '@/routes/profile';
import {waitlist} from '@/routes/waitlist';
import {endpoints} from '@/routes/endpoints';
import {submissions} from '@/routes/submissions';

const router = new OpenAPIHono().basePath('/v1');
security(router);
openApi(router);

router.route('/auth', auth);
router.route('/teams', teams);
router.route('/status', health);
router.route('/profile', profile);
router.route('/waitlist', waitlist);
router.route('/endpoints', endpoints);
router.route('/submissions', submissions);

server(router);
