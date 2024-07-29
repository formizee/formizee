import {newRoute} from '@/lib/hono';
import {registerGetStatus} from './get';

const health = newRoute();

registerGetStatus(health);

export {health};
