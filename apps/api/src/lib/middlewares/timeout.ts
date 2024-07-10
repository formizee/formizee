import {timeout as honoTimeout} from 'hono/timeout';

export const timeout = honoTimeout(5 * 1000);
