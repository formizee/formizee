import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appPath = path.join(__dirname, '../../../../apps/api');
const envPath = path.join(appPath, '.env');

export async function bootstrapApi(resources: {
  workspace: {id: string};
  user: {id: string};
}) {
  const env = marshalEnv({
    Database: {
      DATABASE_URL: 'postgresql://formizee:password@localhost/formizee',
      TESTING_DATABASE_URL: 'postgresql://formizee:password@localhost/testing'
    },
    Bootstrap: {
      WORKSPACE_ID: resources.workspace.id,
      USER_ID: resources.user.id
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
