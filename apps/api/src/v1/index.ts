import {newRoute} from '@/lib/hono';

import {keys} from './keys';
import {health} from './health';
import {endpoints} from './endpoints';
import {submissions, listSubmissions} from './submissions';

const api = newRoute('/');

api.route('/keys', keys);
api.route('/status', health);
api.route('/endpoints', endpoints);


api.route('/submission', submissions);
api.route('/submissions', listSubmissions);

export default api;
