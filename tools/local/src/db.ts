import {pgDrizzle, schema} from '@formizee/db/local';
import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type Database = 'development' | 'testing';

export async function prepareDatabase(): Promise<void> {
  await connectDatabase('development');
  await migrateTables('development');
  await connectDatabase('testing');
  await migrateTables('testing');
}

async function migrateTables(database: Database) {
  await task('migrating tables', async s => {
    const cwd = path.join(__dirname, '../../../packages/db');
    const db = database === 'development' ? 'formizee' : 'testing';

    await new Promise((resolve, reject) => {
      const p = exec('pnpm drizzle-kit push', {
        env: {
          DATABASE_URL: `postgresql://formizee:password@localhost/${db}`,
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
    s.stop(`${database} database ready.`);
  });
}

async function connectDatabase(database: Database = 'development') {
  return await task('Connecting to database', async s => {
    let err: Error | undefined = undefined;
    for (let i = 1; i <= 10; i++) {
      try {
        const connectionString = `postgresql://formizee:password@localhost/${database === 'development' ? 'formizee' : 'testing'}`;
        const client = new pg.Client({connectionString});

        s.message('pinging database');
        await client.connect();
        s.stop(`connected to the ${database} database`);
        return pgDrizzle(client, {schema});
      } catch (e) {
        err = e as Error;
        await new Promise(r => setTimeout(r, 1000 * i));
      }
    }

    throw err;
  });
}
