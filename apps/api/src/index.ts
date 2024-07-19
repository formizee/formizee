import {OpenAPIHono} from '@hono/zod-openapi';
import {security} from '@/lib/middlewares';
import {openApi} from '@/lib/openapi';
import {server} from '@/lib/server';
//import v0 from '@/routes/v0';
import v1 from '@/routes/v1';

const router = new OpenAPIHono();
security(router);
openApi(router);

//router.route('/v0', v0);
router.route('/v1', v1);

server(router);
