import {OpenAPIHono} from '@hono/zod-openapi';
import {security} from '@/lib/middlewares';
import {openApi} from '@/lib/openapi';
import {server} from '@/lib/server';
import v0 from './routes/v0';

const router = new OpenAPIHono();
security(router);
openApi(router);

router.route('/v0', v0);

server(router);
