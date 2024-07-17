import {Hono} from 'hono';
import {describe, it, expect} from 'vitest';
import {getOriginCountry} from './country';

describe('@formizee/location', async () => {
  const app = new Hono();

  app.get('/', async context => {
    const country = await getOriginCountry(context);
    return context.text(country);
  });

  it('Should return Unknown if the ip address is loopback', async () => {
    const response = await app.request('/');

    expect((await response.text()) === '127.0.0.1');
  });
});
