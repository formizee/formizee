import {router} from '@/trpc';

import {updateEndpointNotifications} from './notifications';
import {updateEndpointTargetEmails} from './target-emails';
import {updateEndpointRedirectUrl} from './redirect-url';
import {updateEndpointStatus} from './status';
import {updateEndpointColor} from './color';
import {updateEndpointIcon} from './icon';
import {updateEndpointName} from './name';
import {updateEndpointSlug} from './slug';

export const endpointUpdateRouter = router({
  notifications: updateEndpointNotifications,
  targetEmails: updateEndpointTargetEmails,
  redirectUrl: updateEndpointRedirectUrl,
  status: updateEndpointStatus,
  color: updateEndpointColor,
  icon: updateEndpointIcon,
  slug: updateEndpointSlug,
  name: updateEndpointName
});
