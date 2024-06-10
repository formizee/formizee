import {type JWTPayload, SignJWT, jwtVerify} from 'jose';
import type {Payload, Session, Verification} from './types';

export async function encrypt(
  payload: Payload<Session | Verification>
): Promise<string> {
  const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);

  return new SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

export async function decrypt(
  data: string | undefined = ''
): Promise<JWTPayload> {
  const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const {payload} = await jwtVerify(data, encodedKey, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    throw Error('Failed to verify data');
  }
}
