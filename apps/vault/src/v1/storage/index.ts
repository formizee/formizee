import {authentication} from '@/lib/middlewares/auth';
import {newRoute} from '@/lib/hono';

import {registerGetStorage} from './get';
import {registerPutStorage} from './put';

const storage = newRoute();
storage.use(authentication());

registerGetStorage(storage);
registerPutStorage(storage);

export {storage};
