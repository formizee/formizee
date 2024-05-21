import {getCookie} from 'hono/cookie';
import {decrypt} from './session';
import {Context} from 'hono';

export const verifySession = async (context: Context) => {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(context, cookie);

  if (!session || !session.user) return {isAuth: false, user: undefined};

  return {isAuth: true, user: session.user as string};
};
