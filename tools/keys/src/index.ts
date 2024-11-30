import {aes} from './aes-gcm';
import { base64 } from './base64';

const key = await aes.generateKey();
const stringKey = await aes.exportKey(key);
const encodedKey = base64.encode(stringKey);

console.info('Your AES-GCM new key:');
console.info(encodedKey);
