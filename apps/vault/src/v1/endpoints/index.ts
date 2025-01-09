import {authentication} from '@/lib/middlewares/auth';
import {newRoute} from '@/lib/hono';

import {registerMetricsEndpoint} from './metrics';
import {registerDeleteEndpoint} from './delete';

const endpoints = newRoute();

endpoints.use(authentication());

registerMetricsEndpoint(endpoints);
registerDeleteEndpoint(endpoints);

export {endpoints};
