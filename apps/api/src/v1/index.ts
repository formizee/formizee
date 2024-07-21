import {newRoute} from '@/lib/hono';

import {health} from './health';
import {endpoints} from './endpoints';

const api = newRoute('/');

api.route('/status', health);
api.route('/endpoints', endpoints);

export default api;
