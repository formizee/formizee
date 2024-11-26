import {newRoute} from '@/lib/hono';

import {health} from './health';
import {submissions} from './submissions';

const api = newRoute('/');

api.route('/status', health);
api.route('/submission', submissions);

export default api;
