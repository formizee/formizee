import {aes} from './aes-gcm';

const key = await aes.generateKey();
const stringKey = await aes.exportKey(key);

console.info('Your AES-GCM new key:');
console.info(stringKey);
