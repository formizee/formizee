import * as clack from '@clack/prompts';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marshalEnv} from '../env';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appPath = path.join(__dirname, '../../../../apps/web');
const envPath = path.join(appPath, '.env.local');

export function bootstrapWeb(resources: {
  workspace: {id: string};
  user: {id: string};
}) {
  const env = marshalEnv({
    General: {
      DOCS_URL: "http://localhost:3002",
      WEB_URL: "http://localhost:3000",
      API_URL: "http://localhost:3001"
    },
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
    clack.log.warn('.env already exists, please add the variables manually');
    clack.note(env, envPath);
  } else {
    fs.writeFileSync(envPath, env);
    clack.log.step(`Wrote variables to ${envPath}`);
  }
}
