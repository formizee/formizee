import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appPath = path.join(__dirname, '../../../../apps/api');
const rootPath = path.join(__dirname, '../../../../');
const rootEnvPath = path.join(rootPath, '.env');
const envPath = path.join(appPath, '.env');

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
      return writeEnvFile(env, rootEnvPath);
    }
    clack.note(env, envPath);
    clack.note(env, rootEnvPath);
  } else {
    writeEnvFile(env, envPath);
    writeEnvFile(env, rootEnvPath);
  }
}

const writeEnvFile = (env: string, envPath: string) => {
  fs.writeFileSync(envPath, env);
  clack.log.step(`Wrote variables to ${envPath}`);
};
