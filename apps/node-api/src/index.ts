import {Hono} from 'hono';
import {server} from '@/lib/server';

const router = new Hono();

router.get('/', c => {
  return c.text('Hello Hono!');
});

server(router);
