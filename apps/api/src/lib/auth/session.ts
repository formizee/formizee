import {Uid} from 'domain/models/values';
import {Context} from 'hono';
import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {SignJWT, jwtVerify} from 'jose';

interface SessionPayload {
  user: string;
  expiresAt: Date;
}

export async function encrypt(context: Context, payload: SessionPayload) {
  const encodedKey = new TextEncoder().encode(context.env.SESSION_SECRET);

  return new SignJWT({user: payload.user, expiresAt: payload.expiresAt})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(
  context: Context,
  session: string | undefined = ''
) {
  const encodedKey = new TextEncoder().encode(context.env.SESSION_SECRET);

  try {
    const {payload} = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}

export async function createSession(context: Context, user: Uid) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(context, {user: user.value, expiresAt});

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

export async function deleteSession(context: Context) {
  deleteCookie(context, 'session');
}
