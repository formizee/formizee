import {base64} from '@formizee/encoding';

async function encrypt(
  plainText: string,
  key: CryptoKey
): Promise<{iv: string; cipherText: string}> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random initialization vector
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
    true, // whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt']
  );
}

export const aes = {
  encrypt,
  decrypt,
  generateKey
};
