# Location

We are using `fast-geoip` library to perform local queries with the request ip address and get the country of the request.
This data is completly anonymous and is used for metrics.

## Usage

```typescript
import {getOriginCounty} from '@formizee/location';
import {Hono} from 'hono';

const app = new Hono();

app.get('/api', async context => {
  const country = await getOriginCounty(context);
  return context.text(`Your current country is ${country}`)
})
```
