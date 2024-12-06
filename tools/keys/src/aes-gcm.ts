import {base64} from './base64';

async function encrypt(
  plainText: string,
  key: CryptoKey
): Promise<{iv: string; cipherText: string}> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(plainText);

  const cipherText = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encodedText
  );

  return {
    iv: base64.encode(iv),
    cipherText: base64.encode(new Uint8Array(cipherText))
  };
}

async function decrypt(
  data: {
    cipherText: string;
    iv: string;
  },
  key: CryptoKey
): Promise<string> {
  const decodedCipherText = base64.decode(data.cipherText);
  const decodedIv = base64.decode(data.iv);

  const decryptedText = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(decodedIv)
    },
    key,
    decodedCipherText
  );

  return new TextDecoder().decode(decryptedText);
}

async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('jwk', key);
  return JSON.stringify(exported);
}

async function importKey(keyString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(keyString);
  return await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'AES-GCM'
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export const aes = {
  encrypt,
  decrypt,
  exportKey,
  importKey,
  generateKey
};
