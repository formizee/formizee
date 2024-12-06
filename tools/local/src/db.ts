import path, {dirname} from 'node:path';
import {exec} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {task} from './util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function prepareDatabase(
  database: 'main' | 'submissions'
): Promise<void> {
  if (database === 'main') {
    await migrateTables(database, 'http://localhost:8080', 'pnpm push:main');
  }

  if (database === 'submissions') {
    await migrateTables(
      database,
      'http://localhost:8081',
      'pnpm push:submissions'
    );
  }
}

async function migrateTables(
  database: string,
  databaseUrl: string,
  pushCommand: string
) {
  const packageDir = '../../../packages/db';

  await task('migrating tables', async s => {
    const cwd = path.join(__dirname, packageDir);
    await new Promise((resolve, reject) => {
      const p = exec(pushCommand, {
        env: {
          DATABASE_URL: databaseUrl,
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
