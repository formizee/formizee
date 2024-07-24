import {newRoute} from '@/lib/hono';

import {keys} from './keys';
import {health} from './health';
import {endpoints} from './endpoints';

const api = newRoute('/');

api.route('/keys', keys);
api.route('/status', health);
api.route('/endpoints', endpoints);

export default api;
