import {authentication} from '@/lib/middlewares';
import {pagination} from '@/lib/pagination';
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
registerDeleteEndpoint(endpoints);

const listEndpoints = newRoute();
listEndpoints.use(authentication());
listEndpoints.use(pagination());

registerListEndpoints(listEndpoints);

export {endpoints, listEndpoints};
