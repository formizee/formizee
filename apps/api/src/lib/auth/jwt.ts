import {type JWTPayload, SignJWT, jwtVerify} from 'jose';
import {type Context} from 'hono';
import {type Env} from '@/types';

export interface SessionPayload {
  id: string;
  name: string;
  expiresAt: Date;
  permission: 'user' | 'admin';
}

export async function encrypt(
  context: Context,
  payload: SessionPayload
): Promise<string> {
  const env = context.env as Env;

  const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);

  return new SignJWT({
    uid: payload.id,
    name: payload.name,
    expiresAt: payload.expiresAt,
    permission: payload.permission
  })
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(
  context: Context,
  session: string | undefined = ''
): Promise<JWTPayload> {
  const env = context.env as Env;

  const encodedKey = new TextEncoder().encode(env.SESSION_SECRET);

  try {
    const {payload} = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    throw Error('Failed to verify session');
  }
}
