import type {OpenAPIHono} from '@hono/zod-openapi';
import {serve as server} from '@hono/node-server';
import type {HonoEnv} from '@/lib/hono';
import {performance} from 'node:perf_hooks';
import {version} from '@/../package.json';
import {env} from '@/lib/enviroment';

export const serve = (app: OpenAPIHono<HonoEnv>): void => {
  const startTime = performance.now();

  const BASE_URL = new URL(env.API_URL);
  const PORT = Number(BASE_URL.port);

  console.info(`\n\x1b[1m ▲ Formizee API ${version}\x1b[0m`);
  console.info(` - Local:        \x1b[33m\x1b[4m${BASE_URL.href}\x1b[0m`);
  console.info('\x1b[32m ✓ \x1b[0m Starting...');

  server({
    fetch: app.fetch,
    port: PORT
  });

  const endTime = performance.now();
  const time = Math.round(endTime - startTime).toString();
  console.info(`\x1b[32m ✓ \x1b[0m Ready in ${time}ms\n`);
};
