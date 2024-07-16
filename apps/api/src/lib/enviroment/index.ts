import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';

const envFiles = [
  '.env.local',
  '.env.development.local',
  '.env.development',
  '.env'
];

export const loadedEnviroments: string[] = [];

envFiles.forEach(file => {
  const envPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    loadedEnviroments.push(file);
  }
});

dotenv.config({
  path: envFiles
});
