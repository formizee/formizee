import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {task} from './util.js';
import {execa} from 'execa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function startContainers(services: Array<string>) {
  const cwd = path.join(__dirname, '../../../deployment');

  await task('starting docker services', async s => {
    for (const service of services) {
      s.message(`starting ${service}`);

      await execa('docker', ['compose', 'up', '-d', service], {cwd});
    }
    s.stop('services ready');
  });
}
