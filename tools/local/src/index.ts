import {bootstrapApi, bootstrapWeb} from './commands';
import {execSync} from 'node:child_process';
import path, {dirname} from 'node:path';
import {startContainers} from './docker';
import {fileURLToPath} from 'node:url';
import * as clack from '@clack/prompts';
import {prepareDatabase} from './db';
import {run, task} from './util';

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
      }
    ]
  });

  switch (app) {
    case 'api': {
      await startContainers(['database', 'storage']);

      const resources = await prepareDatabase();
      await bootstrapApi(resources);
      break;
    }

    case 'web': {
      await startContainers(['database', 'storage']);

      const resources = await prepareDatabase();
      bootstrapWeb(resources);
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
