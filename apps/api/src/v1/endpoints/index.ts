import {authentication} from '@/lib/auth';
import {newRoute} from '@/lib/hono';

import {registerGetEndpoint} from './get';
import {registerPutEndpoint} from './put';
import {registerPostEndpoint} from './post';
import {registerListEndpoints} from './list';
import {registerDeleteEndpoint} from './delete';

const endpoints = newRoute();
endpoints.use(authentication());

registerGetEndpoint(endpoints);
registerPutEndpoint(endpoints);
registerPostEndpoint(endpoints);
registerListEndpoints(endpoints);
registerDeleteEndpoint(endpoints);

export {endpoints};
