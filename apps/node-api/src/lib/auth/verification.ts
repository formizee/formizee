import {deleteCookie, getCookie, setCookie} from 'hono/cookie';
import type {Context} from 'hono';
import type {Verification} from './types';
import {encrypt, decrypt} from './jwt';

export async function createVerification(
  context: Context,
  payload: Verification
): Promise<void> {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const data = await encrypt({
    expiresAt,
    data: payload
  });

  setCookie(context, 'verification', data, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/'
  });
}

export async function verifyVerification(context: Context): Promise<{
  isValid: boolean;
  data: Verification | null;
}> {
  const cookie = getCookie(context, 'verification');
  const verification = await decrypt(cookie);
  const data = verification.data as Verification;

  if (!data.email) {
    return {isValid: false, data: null};
  }

  return {isValid: true, data};
}

export function deleteVerification(context: Context): void {
  deleteCookie(context, 'verification');
}
