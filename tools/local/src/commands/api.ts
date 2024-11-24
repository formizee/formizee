import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appPath = path.join(__dirname, '../../../../apps/api');

const envPath = path.join(appPath, '.dev.vars');

export async function bootstrapApi() {
  const env = marshalEnv({
    General: {
      DOCS_URL: 'http://localhost:3002',
      WEB_URL: 'http://localhost:3000',
      API_URL: 'http://localhost:8787',
      ENVIROMENT: 'development',
      VERSION: '1.0.0'
    },
    Database: {
      DATABASE_URL: 'http://database:8080'
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
