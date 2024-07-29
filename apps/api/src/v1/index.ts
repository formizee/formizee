import {newRoute} from '@/lib/hono';

import {health} from './health';
import {keys, listKeys} from './keys';
import {endpoints, listEndpoints} from './endpoints';
import {submissions, listSubmissions} from './submissions';

const api = newRoute('/');

api.route('/status', health);

api.route('/key', keys);
api.route('/keys', listKeys);

api.route('/endpoint', endpoints);
api.route('/endpoints', listEndpoints);

api.route('/submission', submissions);
api.route('/submissions', listSubmissions);

export default api;
