import * as dotenv from 'dotenv';
import {findUpSync} from 'find-up';

const envFiles = [
  '.env.local',
  '.env.development.local',
  '.env.development',
  '.env'
];

export const loadedEnviroments: string[] = [];
export const enviromentsToLoad: string[] = [];

envFiles.forEach(file => {
  const envPath = findUpSync(file);
  if (envPath !== undefined) {
    loadedEnviroments.push(file);
    enviromentsToLoad.push(envPath);
  }
});

dotenv.config({
  path: enviromentsToLoad
});
