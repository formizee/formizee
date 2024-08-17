import {router} from '@/trpc';

import {getEndpointBySlug} from './get';
import {deleteEndpoint} from './delete';
import {createEndpoint} from './create';
import {updateEndpoint} from './update';
import {listEndpoints} from './list';

export const endpointRouter = router({
  getBySlug: getEndpointBySlug,
  delete: deleteEndpoint,
  create: createEndpoint,
  update: updateEndpoint,
  list: listEndpoints
});
