import {createClient} from '@libsql/client';
import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function prepareDatabase(): Promise<void> {
  await connectDatabase();
  await migrateTables();
}

async function migrateTables() {
  await task('migrating tables', async s => {
    const cwd = path.join(__dirname, '../../../packages/db');

    await new Promise((resolve, reject) => {
      const p = exec('pnpm run push', {
        env: {
          DATABASE_URL: 'http://database:8080',
          ...process.env
        },
        cwd
      });
      p.on('exit', code => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    });
    s.stop('database ready.');
  });
}

async function connectDatabase() {
  return await task('Connecting to database', async s => {
    let err: Error | undefined = undefined;
    for (let i = 1; i <= 10; i++) {
      try {
        const client = createClient({
          url: 'http://database:8080'
        });

        s.message('pinging database');
        client.close();
        s.stop('connected to the database');
      } catch (e) {
        err = e as Error;
        await new Promise(r => setTimeout(r, 1000 * i));
      }
    }

    throw err;
  });
}
