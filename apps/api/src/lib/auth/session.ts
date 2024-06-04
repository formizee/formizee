import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {type Context} from 'hono';
import {type Env} from '@/types';
import {type SessionPayload, encrypt, decrypt} from './jwt';

export async function createSession(
  context: Context,
  payload: Omit<SessionPayload, 'expiresAt'>
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const env = context.env as Env;

  const session = await encrypt(context, {
    expiresAt,
    uid: payload.uid,
    name: payload.name,
    permission: payload.permission
  });

  setCookie(context, 'session', session, {
    secure: env.WORKER_ENV === 'prod',
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

export async function verifySession(
  context: Context
): Promise<{isAuth: boolean; user: Omit<SessionPayload, 'expiresAt'> | null}> {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(context, cookie);

  if (!session.uid) return {isAuth: false, user: null};

  return {
    isAuth: true,
    user: {
      uid: session.uid as string,
      name: session.name as string,
      permission: session.permission === 'admin' ? 'admin' : 'user'
    }
  };
}

export function deleteSession(context: Context): void {
  deleteCookie(context, 'session');
}
