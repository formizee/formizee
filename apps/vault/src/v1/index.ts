import {newRoute} from '@/lib/hono';

import {health} from './health';
import {listSubmissions, submissions} from './submissions';

const api = newRoute('/');

api.route('/status', health);
api.route('/submission', submissions);
api.route('/submissions', listSubmissions);

export default api;
