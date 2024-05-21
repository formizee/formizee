import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {encrypt, decrypt} from './jwt';

import {Context} from 'hono';

export async function createSession(context: Context, userUid: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(context, {user: userUid, expiresAt});

  setCookie(context, 'session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

export async function updateSession(context: Context) {
  const session = getCookie(context, 'session');
  const payload = await decrypt(context, session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  setCookie(context, 'session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/'
  });
}

export async function verifySession (context: Context) {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(context, cookie);

  if (!session || !session.user) return {isAuth: false, user: undefined};

  return {isAuth: true, user: session.user as string};
};

export async function deleteSession(context: Context) {
  deleteCookie(context, 'session');
}

