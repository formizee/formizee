import {authentication} from '@/lib/middlewares/auth';
import {newRoute} from '@/lib/hono';

import {registerDeleteEndpoint} from './delete';

const endpoints = newRoute();

endpoints.use(authentication());
registerDeleteEndpoint(endpoints);

export {endpoints};
