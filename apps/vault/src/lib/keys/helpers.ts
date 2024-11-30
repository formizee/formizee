import type {Env} from '@/lib/enviroment';
import {aes} from '@formizee/encryption';
import type {DEK, MasterKey} from './types';
import { base64 } from '@formizee/encoding';

export async function getLatestMasterKey(env: Env): Promise<MasterKey> {
  // Dynamically find keys matching "MASTER_KEY_"
  const keys = Object.keys(env).filter(key => key.startsWith('MASTER_KEY_'));

  if (!keys.length) {
    throw new Error('No master keys defined in the environment');
  }

  // Sort by version number (assuming the format MASTER_KEY_V#)
  keys.sort((a, b) => {
    const versionA = Number.parseInt(a.split('_V')[1] || '0', 10);
    const versionB = Number.parseInt(b.split('_V')[1] || '0', 10);
    return versionB - versionA; // Descending order
  });

  const latestKeyName = keys[0]; // The name of the latest key
  const latestKey = env[latestKeyName as keyof Env] as string; // Explicit type narrowing

  if (!latestKey) {
    throw new Error(`Latest key (${latestKeyName}) is undefined`);
  }

  const versionMatch = latestKeyName?.split('_V');
  const version = versionMatch
    ? Number.parseInt(versionMatch[1] || '1', 10)
    : 1;

  try {
    const decodedKey = new TextDecoder().decode(base64.decode(latestKey));
    const key = await aes.importKey(decodedKey);
    return {key, version};
  } catch {
    throw new Error(`Master Key (${latestKeyName}) can't be imported`);
  }
}

export async function getMasterKey(
  env: Env,
  version: number
): Promise<MasterKey> {
  const keyName = `MASTER_KEY_V${version}`;
  const keyString = env[keyName as keyof Env] as string;

  if (!keyString) {
    throw new Error(`Master key for version ${version} is not defined.`);
  }

  try {
    const decodedKey = new TextDecoder().decode(base64.decode(keyString));
    const key = await aes.importKey(decodedKey);
    return {
      key,
      version
    };
  } catch {
    throw new Error(`Master Key (${keyName}) can't be imported`);
  }
}

export async function encryptDEK(
  masterKey: MasterKey
): Promise<{key: CryptoKey; dek: DEK}> {
  const key = await aes.generateKey();
  const stringKey = await aes.exportKey(key);

  const data = await aes.encrypt(stringKey, masterKey.key);

  return {
    key,
    dek: {
      data,
      metadata: {
        version: masterKey.version
      }
    }
  };
}

export async function decryptDEK(
  dek: DEK,
  masterKey: MasterKey
): Promise<{key: CryptoKey; version: number}> {
  const keyString = await aes.decrypt(dek.data, masterKey.key);
  const key = await aes.importKey(keyString);

  return {
    key,
    version: dek.metadata.version
  };
}
