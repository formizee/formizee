import {Hono} from 'hono';
import {server} from '@/lib/server';

const router = new Hono().basePath('/v1');

router.get('/status', context => context.text('OK', 200));

server(router);
