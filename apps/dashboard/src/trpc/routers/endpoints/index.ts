import {router} from '@/trpc';

import {getEndpointBySlug} from './get';
import {createEndpoint} from './create';
import {updateEndpoint} from './update';
import {listEndpoints} from './list';

export const endpointRouter = router({
  getBySlug: getEndpointBySlug,
  create: createEndpoint,
  update: updateEndpoint,
  list: listEndpoints
});
