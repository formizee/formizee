import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appPath = path.join(__dirname, '../../../../apps/web');
const rootPath = path.join(__dirname, '../../../../');
const rootEnvPath = path.join(rootPath, '.env');
const envPath = path.join(appPath, '.env.local');

export function bootstrapWeb() {
  const env = marshalEnv({
    General: {
      DASHBOARD_URL: 'http://localhost:3001',
      DOCS_URL: 'http://localhost:3002',
      WEB_URL: 'http://localhost:3000',
      API_URL: 'http://localhost:8787'
    }
  });

  if (fs.existsSync(envPath)) {
    clack.log.warn('.env already exists, please add the variables manually');
    clack.note(env, envPath);
    clack.note(env, rootEnvPath);
  } else {
    fs.writeFileSync(envPath, env);
    fs.writeFileSync(rootEnvPath, env);
    clack.log.step(`Wrote variables to ${envPath}`);
    clack.log.step(`Wrote variables to ${rootEnvPath}`);
  }
}
