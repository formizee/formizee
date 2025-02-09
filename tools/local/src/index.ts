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
  bootstrapVault,
  bootstrapDashboard
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
        label: 'web',
        value: 'web',
        hint: 'formizee.com'
      },
      {
        label: 'api',
        value: 'api',
        hint: 'api.formizee.com'
      },
      {
        label: 'docs',
        value: 'docs',
        hint: 'docs.formizee.com'
      },
      {
        label: 'vault',
        value: 'vault',
        hint: 'vault.formizee.com'
      },
      {
        label: 'dashboard',
        value: 'dashboard',
        hint: 'dashboard.formizee.com'
      }
    ]
  });

  switch (app) {
    case 'web': {
      bootstrapWeb();
      break;
    }

    case 'api': {
      await startContainers([
        'analytics',
        'database',
        'submissions-database',
        'vault',
        'analytics_migrator'
      ]);
      await prepareDatabase('submissions');
      await prepareDatabase('main');

      await bootstrapApi();
      break;
    }

    case 'vault': {
      await startContainers([
        'analytics',
        'submissions-database',
        'storage',
        'analytics_migrator'
      ]);
      await prepareDatabase('submissions');

      await bootstrapVault();
      break;
    }

    case 'dashboard': {
      await startContainers([
        'database',
        'submissions-database',
        'analytics',
        'api',
        'vault',
        'analytics_migrator'
      ]);
      await prepareDatabase('submissions');
      await prepareDatabase('main');

      bootstrapDashboard();
      break;
    }

    default: {
    }
  }

  await task('Building ...', async s => {
    await run(`pnpm turbo run build --filter=./apps/${String(app)}^...`, {
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
    execSync(`pnpm --dir=apps/${String(app)} dev`, {
      cwd: '../..',
      stdio: 'inherit'
    });
  } else {
    clack.note(
      `pnpm --dir=apps/${String(app)} dev`,
      `Run the ${String(app)} later with the following command`
    );
  }

  clack.outro('Done');
  process.exit(0);
}

main().catch(err => {
  clack.log.error(err);
});
