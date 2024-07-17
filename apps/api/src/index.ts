import {security} from '@/lib/middlewares';
import {openApi} from '@/lib/openapi';
import {server} from '@/lib/server';
import {apiKeys} from '@/routes/api-keys';
import {auth} from '@/routes/auth';
import {endpoints} from '@/routes/endpoints';
import {health} from '@/routes/health';
import {profile} from '@/routes/profile';
import {submissions} from '@/routes/submissions';
import {teams} from '@/routes/teams';
import {waitlist} from '@/routes/waitlist';
import {OpenAPIHono} from '@hono/zod-openapi';

const router = new OpenAPIHono().basePath('/v1');
security(router);
openApi(router);

router.route('/auth', auth);
router.route('/teams', teams);
router.route('/status', health);
router.route('/profile', profile);
router.route('/api-keys', apiKeys);
router.route('/waitlist', waitlist);
router.route('/endpoints', endpoints);
router.route('/submissions', submissions);

server(router);
