import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {SignJWT, jwtVerify} from 'jose';
import {Context} from 'hono';

interface VerificationPayload {
  email: string;
  type: 'account' | 'password';
}

export async function encrypt(context: Context, payload: VerificationPayload) {
  const encodedKey = new TextEncoder().encode(context.env.SESSION_SECRET);

  return new SignJWT({email: payload.email, type: payload.type})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey);
}

export async function decrypt(context: Context, data: string | undefined = '') {
  const encodedKey = new TextEncoder().encode(context.env.SESSION_SECRET);

  try {
    const {payload} = await jwtVerify(data, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify data.');
  }
}

export async function createVerification(
  context: Context,
  email: string,
  type: 'account' | 'password'
) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const data = await encrypt(context, {email, type});

  setCookie(context, 'verification', data, {
    secure: context.env.WORKER_ENV === 'prod',
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

export async function readVerification(context: Context) {
  const cookie = getCookie(context, 'verification');
  const data = await decrypt(context, cookie);

  if (!data || !data.email)
    return {isValid: false, email: undefined, type: 'account'};

  return {isValid: true, email: data.email as string, type: data.type};
}

export async function deleteVerification(context: Context) {
  deleteCookie(context, 'verification');
}
