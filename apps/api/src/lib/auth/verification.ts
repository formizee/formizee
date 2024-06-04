import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import {type JWTPayload, SignJWT, jwtVerify} from 'jose';
import {type Context} from 'hono';
import {type Env} from '@/types';

interface VerificationPayload {
  email: string;
  type: 'account' | 'password';
}

export async function encrypt(
  context: Context,
  payload: VerificationPayload
): Promise<string> {
  const env = context.env as Env;

  const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);

  return new SignJWT({email: payload.email, type: payload.type})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey);
}

export async function decrypt(
  context: Context,
  data: string | undefined = ''
): Promise<JWTPayload | undefined> {
  const env = context.env as Env;

  const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);

  try {
    const {payload} = await jwtVerify(data, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    throw Error('Failed to verify data.');
  }
}

export async function createVerification(
  context: Context,
  email: string,
  type: 'account' | 'password'
): Promise<void> {
  const env = context.env as Env;

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const data = await encrypt(context, {email, type});

  setCookie(context, 'verification', data, {
    secure: env.WORKER_ENV === 'prod',
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

export async function readVerification(context: Context): Promise<{
  isValid: boolean;
  email: string | undefined;
  type: 'account' | 'password';
}> {
  const cookie = getCookie(context, 'verification');
  const data = await decrypt(context, cookie);

  if (!data?.email) {
    return {isValid: false, email: undefined, type: 'account'};
  }

  return {
    isValid: true,
    email: data.email as string,
    type: data.type === 'account' ? 'account' : 'password'
  };
}

export function deleteVerification(context: Context): void {
  deleteCookie(context, 'verification');
}
