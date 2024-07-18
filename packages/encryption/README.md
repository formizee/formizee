# Encryption

The library to go when using encryption on Formizee.

## AES GCM

```typescript
import {aes} from '@formizee/encryption';

// Generate a new key.
const key = await aes.generateKey();

// Use the key to encrypt some string.
const encrypted = await aes.encrypt("secret string", key);

// Decrypt the cypher text with the same key.
const decrypted = await aes.decrypt(encrypted, key);

```
