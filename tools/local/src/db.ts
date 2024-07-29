import {pgDrizzle, schema} from '@formizee/db/local';
import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util';
import pg from 'pg';

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
      const p = exec('pnpm drizzle-kit push', {
        env: {
          DATABASE_URL: 'postgresql://formizee:password@localhost/formizee',
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
        const connectionString =
          'postgresql://formizee:password@localhost/formizee';
        const client = new pg.Client({connectionString});

        s.message('pinging database');
        await client.connect();
        s.stop('connected to the database');
        return pgDrizzle(client, {schema});
      } catch (e) {
        err = e as Error;
        await new Promise(r => setTimeout(r, 1000 * i));
      }
    }

    throw err;
  });
}
