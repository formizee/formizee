import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, '../../../../packages/db');
const appPath = path.join(__dirname, '../../../../apps/api');
const rootPath = path.join(__dirname, '../../../../');

const envPath = path.join(appPath, '.env');
const dbEnvPath = path.join(dbPath, '.env');
const rootEnvPath = path.join(rootPath, '.env');

export async function bootstrapApi() {
  const env = marshalEnv({
    General: {
      DOCS_URL: 'http://localhost:3002',
      WEB_URL: 'http://localhost:3000',
      API_URL: 'http://localhost:3001',
      NODE_ENV: 'development'
    },
    Database: {
      DATABASE_URL: 'postgresql://formizee:password@localhost/formizee',
      TESTING_DATABASE_URL: 'postgresql://formizee:password@localhost/testing'
    }
  });

  const dbEnv = marshalEnv({
    Database: {
      DATABASE_URL: 'postgresql://formizee:password@localhost/formizee',
      TESTING_DATABASE_URL: 'postgresql://formizee:password@localhost/testing'
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
      writeEnvFile(env, envPath);
      writeEnvFile(dbEnv, dbEnvPath);
      return writeEnvFile(env, rootEnvPath);
    }
    clack.note(env, envPath);
    clack.note(dbEnv, dbEnvPath);
    clack.note(env, rootEnvPath);
  } else {
    writeEnvFile(env, envPath);
    writeEnvFile(dbEnv, dbEnvPath);
    writeEnvFile(env, rootEnvPath);
  }
}

const writeEnvFile = (env: string, envPath: string) => {
  fs.writeFileSync(envPath, env);
  clack.log.step(`Wrote variables to ${envPath}`);
};
