import {describe, expect, it} from 'vitest';
import {aes} from './aes-gcm';

describe('@formizee/encryption', () => {
  it('Should generate new keys (AES-GCM)', async () => {
    const key = await aes.generateKey();
    expect(key instanceof CryptoKey).toBe(true);
  });

  it('Should encrypt/decrypt (AES-GCM)', async () => {
    const plainText = 'formizee';

    const key = await aes.generateKey();
    const encrypted = await aes.encrypt(plainText, key);

    const result = await aes.decrypt(encrypted, key);
    expect(result).toBe(plainText);
  });

  it('Should export/import keys (AES-GCM)', async () => {
    const key = await aes.generateKey();

    const keyString = await aes.exportKey(key);
    const result = await aes.importKey(keyString);

    expect(result).toStrictEqual(key);
  });
});
