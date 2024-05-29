import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {type SessionPayload, encrypt, decrypt} from './jwt';
import {Context} from 'hono';

export async function createSession(context: Context, payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await encrypt(context, {
    expiresAt,
    uid: payload.uid,
    name: payload.name,
    permission: payload.permission,
  });

  setCookie(context, 'session', session, {
    secure: context.env.WORKER_ENV === 'prod',
    httpOnly: true,
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
    secure: context.env.WORKER_ENV === 'prod',
    httpOnly: true,
    expires: expires,
    sameSite: 'lax',
    path: '/'
  });
}

export async function verifySession(context: Context) {
  const cookie = getCookie(context, 'session');
  const session = await decrypt(context, cookie);

  if (!session || !session.uid) return {isAuth: false, user: null};

  return {
    isAuth: true,
    user: {
      uid: session.uid as string,
      name: session.name as string,
      permission: session.permission as string
    }
  };
}

export async function deleteSession(context: Context) {
  deleteCookie(context, 'session');
}
