import {execSync} from 'node:child_process';
import {startContainers} from './docker';
import path, {dirname} from 'node:path';
import * as clack from '@clack/prompts';
import {fileURLToPath} from 'node:url';
import {prepareDatabase} from './db';
import {run, task} from './util';

import {
  bootstrapApi,
  bootstrapWeb,
  bootstrapDashboard,
  bootstrapVault
} from './commands';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  clack.intro('Setting up Formizee locally...');

  const app = await clack.select({
    message: 'What would you like to develop?',
    maxItems: 1,
    options: [
      {
        label: 'API',
        value: 'api',
        hint: 'api.formizee.com'
      },
      {
        label: 'Web',
        value: 'web',
        hint: 'formizee.com'
      },
      {
        label: 'Docs',
        value: 'docs',
        hint: 'docs.formizee.com'
      },
      {
        label: 'Vault',
        value: 'vault',
        hint: 'vault.formizee.com'
      },
      {
        label: 'Dashboard',
        value: 'dashboard',
        hint: 'dashboard.formizee.com'
      }
    ]
  });

  switch (app) {
    case 'api': {
      await startContainers(['main-database']);
      await prepareDatabase('main');

      await bootstrapApi();
      break;
    }

    case 'dashboard': {
      await startContainers(['main-database']);
      await prepareDatabase('main');

      bootstrapDashboard();
      break;
    }

    case 'vault': {
      await startContainers(['submissions-database', 'storage']);
      await prepareDatabase('submissions');

      bootstrapVault();
      break;
    }

    case 'docs': {
      break;
    }

    case 'web': {
      await startContainers(['main-database']);
      await prepareDatabase('main');

      bootstrapWeb();
      break;
    }

    default: {
    }
  }

  await task('Building ...', async s => {
    await run(`pnpm turbo run build --filter=./apps/${app}^...`, {
      cwd: path.join(__dirname, '../../../')
    });
    s.stop('build complete');
  });

  const runDev = await clack.confirm({
    message: 'Run now?',
    active: 'Yes',
    inactive: 'No',
    initialValue: true
  });
  if (runDev) {
    execSync(`pnpm --dir=apps/${app} dev`, {cwd: '../..', stdio: 'inherit'});
  } else {
    clack.note(
      `pnpm --dir=apps/${app} dev`,
      `Run the ${app} later with the following command`
    );
  }

  clack.outro('Done');
  process.exit(0);
}

main().catch(err => {
  clack.log.error(err);
});
