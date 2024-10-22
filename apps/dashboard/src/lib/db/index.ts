import {createConnection} from '@formizee/db/web';
import {env} from '@/lib/enviroment';

export const database = createConnection(env().DATABASE_URL);
export * from '@formizee/db';
