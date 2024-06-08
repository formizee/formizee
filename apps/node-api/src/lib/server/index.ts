import {performance} from 'perf_hooks';
import {createServer} from 'node:https';
import {serve} from '@hono/node-server';
import type {Hono} from 'hono';
import {loadedEnviroments} from '@/lib/enviroment';
import {version} from '@/../package.json';

export const server = (app: Hono): void => {
  const BASE_URL = process.env.BASE_URL ?? 'http://localhost';
  const PORT = Number(process.env.PORT ?? 3000);

  const run = (port?: number): void => {
    const startTime = performance.now();

    const currentPort = port ?? PORT;

    let enviroments = '';
    loadedEnviroments.forEach((file, index) => {
      enviroments += file;
      if (index !== loadedEnviroments.length - 1) {
        enviroments += ', ';
      }
    });

    console.info(`\x1b[1m ▲ Formizee API ${version}\x1b[0m`);
    console.info(
      ` - Local:        \x1b[33m\x1b[4m${BASE_URL}:${currentPort.toString()}\x1b[0m`
    );
    console.info(` - Enviroments:  ${enviroments}\n`);
    console.info(`\x1b[32m ✓ \x1b[0m Starting...`);

    serve({
      fetch: app.fetch,
      createServer,
      port: currentPort
    });

    const endTime = performance.now();
    const time = Math.round(endTime - startTime).toString();
    console.info(`\x1b[32m ✓ \x1b[0m Ready in ${time}ms`);
  };

  run();
};
