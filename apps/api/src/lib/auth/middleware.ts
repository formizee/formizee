import {HTTPException} from 'hono/http-exception';
import {createMiddleware} from 'hono/factory';
import {getCookie} from 'hono/cookie';
import type {Session} from './types';
import {decrypt} from './jwt';

export const authentication = createMiddleware(async (context, next) => {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(cookie);
  const data = session?.data as Session;

  if (!session || !data.id) {
    const error = {
      name: 'Unauthorized',
      message: 'Please, login in order to perform this action.'
    };

    const res = new Response(JSON.stringify(error), {
      headers: {'Content-Type': 'application/json'},
      status: 401
    });
    throw new HTTPException(401, {res});
  }

  // eslint-disable-next-line -- This needs to be changed
  context.env.session = {user: data.id};

  await next();
});
