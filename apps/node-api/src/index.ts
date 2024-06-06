import {serve} from '@hono/node-server';
import {Hono} from 'hono';
import '@/lib/enviroment';

const app = new Hono();

app.get('/', c => {
  return c.text('Hello Hono!');
});

console.log(`Server is running on port ${process.env.PORT!}`);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT!)
});
