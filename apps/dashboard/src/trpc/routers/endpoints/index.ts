import {endpointUpdateRouter} from './update';
import {router} from '@/trpc';

import {getEndpointMetrics} from './metrics';
import {getEndpointBySlug} from './get';
import {deleteEndpoint} from './delete';
import {createEndpoint} from './create';
import {listEndpoints} from './list';

export const endpointRouter = router({
  update: endpointUpdateRouter,
  metrics: getEndpointMetrics,
  get: getEndpointBySlug,
  delete: deleteEndpoint,
  create: createEndpoint,
  list: listEndpoints
});
