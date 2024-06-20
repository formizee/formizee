import {getCookie, setCookie, deleteCookie} from 'hono/cookie';
import type {Context} from 'hono';
import type {Session} from './types';
import {encrypt, decrypt} from './jwt';

export async function createSession(
  context: Context,
  payload: Session
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt({
    expiresAt,
    data: payload
  });

  setCookie(context, 'session', session, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

export async function verifySession(
  context: Context
): Promise<{isAuth: boolean; user: Session | null}> {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(cookie);
  const data = session?.data as Session;

  if (!session || !data.uid) {
    return {isAuth: false, user: null};
  }

  return {
    isAuth: true,
    user: data
  };
}

export function deleteSession(context: Context): void {
  deleteCookie(context, 'session');
}
