import {cors as honoCors} from 'hono/cors';
import {env} from '@/lib/enviroment';

export const cors = honoCors({
  origin: env.WEB_URL,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
});
