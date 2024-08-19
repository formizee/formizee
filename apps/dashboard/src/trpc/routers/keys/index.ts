import {router} from '@/trpc';

import {createKey} from './create';
import {updateKey} from './update';
import {deleteKey} from './delete';
import {listKeys} from './list';

export const keyRouter = router({
  create: createKey,
  update: updateKey,
  delete: deleteKey,
  list: listKeys
});
