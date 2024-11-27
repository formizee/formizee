import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function prepareDatabase(): Promise<void> {
  await migrateTables();
}

async function migrateTables() {
  const packageDir = '../../../packages/db';
  const dataseUrl = 'http://locahost:8080';

  await task('migrating tables', async s => {
    const cwd = path.join(__dirname, packageDir);

    await new Promise((resolve, reject) => {
      const p = exec('pnpm run push', {
        env: {
          DATABASE_URL: dataseUrl,
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
