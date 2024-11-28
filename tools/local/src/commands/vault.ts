import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appPath = path.join(__dirname, '../../../../apps/vault');

const envPath = path.join(appPath, '.dev.vars');

export async function bootstrapVault() {
  const env = marshalEnv({
    General: {
      ENVIROMENT: 'development'
    },
    Storage: {
      STORAGE_SECRET_ACCESS_KEY: 'minio_root_password',
      STORAGE_ACCESS_KEY_ID: 'minio_root_user',
      STORAGE_ENDPOINT: 'http://storage:3902',
      STORAGE_BUCKET: 'storage'
    },
    Database: {
      DATABASE_URL: 'http://localhost:8081'
    }
  });

  if (fs.existsSync(envPath)) {
    const overrideDotEnv = await clack.select({
      message: '.env already exists, do you want to override it?',
      initialValue: false,
      options: [
        {value: false, label: 'No(Add the variables manually)'},
        {value: true, label: 'Yes'}
      ]
    });

    if (overrideDotEnv) {
      return writeEnvFile(env, envPath);
    }
    clack.note(env, envPath);
  } else {
    writeEnvFile(env, envPath);
  }
}

const writeEnvFile = (env: string, envPath: string) => {
  fs.writeFileSync(envPath, env);
  clack.log.step(`Wrote variables to ${envPath}`);
};
