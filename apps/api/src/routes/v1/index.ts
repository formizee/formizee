import {OpenAPIHono} from '@hono/zod-openapi';
import {healthAPI} from './health';

const router = new OpenAPIHono();

router.route('/status', healthAPI);

export default router;
