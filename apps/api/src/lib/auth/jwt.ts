import { SignJWT, jwtVerify } from 'jose';
import { Context } from 'hono';

export interface SessionPayload {
  uid: string;
  name: string;
  expiresAt: Date;
  permission: 'user' | 'admin';
}

export async function encrypt(context: Context, payload: SessionPayload) {
  const encodedKey = new TextEncoder().encode(context.env.SESSION_SECRET);

  return new SignJWT({
    uid: payload.uid,
    name: payload.name,
    expiresAt: payload.expiresAt,
    permission: payload.permission
  })
    .setProtectedHeader({ alg: 'HS256' })
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
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}
