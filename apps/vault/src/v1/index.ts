import {newRoute} from '@/lib/hono';

import {health} from './health';
import {endpoints} from './endpoints';
import {listSubmissions, submissions} from './submissions';

const api = newRoute('/');

api.route('/status', health);
api.route('/endpoint', endpoints);
api.route('/submission', submissions);
api.route('/submissions', listSubmissions);

export default api;
