import {newRoute} from '@/lib/hono';

import {registerDeleteEndpoint} from './delete';

const endpoints = newRoute();

registerDeleteEndpoint(endpoints);

export {endpoints};
