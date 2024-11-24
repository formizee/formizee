import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type DatabaseType = 'main' | 'submissions';

export async function prepareDatabase(database: DatabaseType): Promise<void> {
  await migrateTables(database);
}

async function migrateTables(database: DatabaseType) {
  const packageDir =
    database === 'main'
      ? '../../../packages/db-main'
      : '../../../packages/db-submissions';
  const dataseUrl =
    database === 'main' ? 'http://locahost:8080' : 'http://localhost:8081';

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
