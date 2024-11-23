import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function prepareDatabase(): Promise<void> {
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
