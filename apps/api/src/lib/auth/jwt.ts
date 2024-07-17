import {type JWTPayload, SignJWT, jwtVerify} from 'jose';
import type {Data, Payload} from './types';

export async function encrypt(payload: Payload<Data>): Promise<string> {
  const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);

  return new SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

export async function decrypt(
  data: string | undefined = ''
): Promise<JWTPayload | null> {
  const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const {payload} = await jwtVerify(data, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (_error) {
    console.error('Failed on decrypt JWT data:', data);
    return null;
  }
}
