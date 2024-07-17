import {performance} from 'node:perf_hooks';
import {version} from '@/../package.json';
import {loadedEnviroments} from '@/lib/enviroment';
import {serve} from '@hono/node-server';
import type {OpenAPIHono} from '@hono/zod-openapi';

export const server = (app: OpenAPIHono): void => {
  const startTime = performance.now();

  if (!process.env.API_URL) {
    throw new Error('API_URL enviroment variable is not defined.');
  }

  const BASE_URL = new URL(process.env.API_URL);
  const PORT = Number(BASE_URL.port);

  let enviroments = '';
  loadedEnviroments.forEach((file, index) => {
    enviroments += file;
    if (index !== loadedEnviroments.length - 1) {
      enviroments += ', ';
    }
  });

  console.info(`\x1b[1m ▲ Formizee API ${version}\x1b[0m`);
  console.info(` - Local:        \x1b[33m\x1b[4m${BASE_URL.href}\x1b[0m`);
  console.info(` - Enviroments:  ${enviroments}\n`);
  console.info('\x1b[32m ✓ \x1b[0m Starting...');

  serve({
    fetch: app.fetch,
    port: PORT
  });

  const endTime = performance.now();
  const time = Math.round(endTime - startTime).toString();
  console.info(`\x1b[32m ✓ \x1b[0m Ready in ${time}ms\n`);
};
