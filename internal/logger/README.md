# Console Logger

This package is used to log cloudflare worker events to Better Stack Logtail

```typescript
import {ConsoleLogger} from '@formizee/logger';

const logger = new ConsoleLogger({
  emitLogs: true,
  defaultFields: {},
  ctx: c.executionCtx,
  application: 'vault',
  logtailToken: '<token>',
  environment: 'production',
  requestId: 'request_123456789'
})

logger.error("This is an error.");

```
