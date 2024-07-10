import * as dotenv from 'dotenv';
import {findUp} from 'find-up';

const envFiles = [
  '.env.local',
  '.env.development.local',
  '.env.development',
  '.env'
];

export const loadedEnviroments: string[] = [];
export const enviromentsToLoad: string[] = [];

for (const file of envFiles) {
  const envPath = await findUp(file);
  if (envPath !== undefined) {
    loadedEnviroments.push(file);
    enviromentsToLoad.push(envPath);
  }
}

dotenv.config({
  path: enviromentsToLoad
});
