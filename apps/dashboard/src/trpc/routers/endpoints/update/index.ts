import {router} from '@/trpc';

import {updateEndpointTargetEmails} from './target-emails';
import {updateEndpointColor} from './color';
import {updateEndpointIcon} from './icon';
import {updateEndpointName} from './name';
import {updateEndpointSlug} from './slug';

export const endpointUpdateRouter = router({
  targetEmails: updateEndpointTargetEmails,
  color: updateEndpointColor,
  icon: updateEndpointIcon,
  slug: updateEndpointSlug,
  name: updateEndpointName
});
