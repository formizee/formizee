import {newRoute} from '@/lib/hono';

import {health} from './health';
import {workspaces} from './workspaces';

const api = newRoute('/');

api.route('/status', health);

api.route('/workspace', workspaces);

export default api;
