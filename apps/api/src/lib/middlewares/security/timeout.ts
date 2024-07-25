import {HTTPException} from 'hono/http-exception';
import {timeout as honoTimeout} from 'hono/timeout';

const error = new HTTPException(504, {
  message: 'Our servers are experiencing problems, please try again later'
});

export const timeout = honoTimeout(7 * 1000, error);
