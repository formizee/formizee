# Vault

This package is a typed api to access the Formizee Vault service.

## Usage

```typescript
import {Vault} from '@formizee/vault';

const vault = new Vault({
  url: "http://localhost:8888",
  token: '<your-token>'
})

const submission = await vault.submissions.get({
  endpointId: 'enp_123456789',
  id: 'sub_123456789'
})

console.log(submission.id) // <-- Your fullty typed submission request
```
