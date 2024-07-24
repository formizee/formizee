import {authentication} from '@/lib/middlewares';
import {newRoute} from '@/lib/hono';

import {registerDeleteKey} from './delete';
import {registerVerifyKey} from './verify';
import {registerListKeys} from './list';
import {registerPostKey} from './post';
import {registerPutKey} from './put';

const keys = newRoute();
keys.use(authentication());

registerDeleteKey(keys);
registerVerifyKey(keys);
registerPostKey(keys);
registerPutKey(keys);

const listKeys = newRoute();
listKeys.use(authentication());
registerListKeys(listKeys);

export {keys, listKeys};
