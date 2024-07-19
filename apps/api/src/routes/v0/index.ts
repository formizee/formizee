import {auth} from './auth';
import {teams} from './teams';
import {health} from './health';
import {profile} from './profile';
import {apiKeys} from './api-keys';
import {waitlist} from './waitlist';
import {endpoints} from './endpoints';
import {submissions} from './submissions';
import {OpenAPIHono} from '@hono/zod-openapi';

const router = new OpenAPIHono();

router.route('/auth', auth);
router.route('/teams', teams);
router.route('/status', health);
router.route('/profile', profile);
router.route('/api-keys', apiKeys);
router.route('/waitlist', waitlist);
router.route('/endpoints', endpoints);
router.route('/submissions', submissions);

export default router;
