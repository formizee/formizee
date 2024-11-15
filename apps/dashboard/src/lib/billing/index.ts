import {Polar} from '@polar-sh/sdk';
import {env} from '../enviroment';

export const billing = new Polar({
  accessToken: env().POLAR_ACCESS_TOKEN,
  server: env().VERCEL_ENV !== 'production' ? 'sandbox' : 'production'
});
