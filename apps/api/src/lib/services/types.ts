import type {Analytics} from '@formizee/analytics';
import type {KeyService} from '@formizee/keys';

export interface Services {
  keyService: KeyService;
  analytics: Analytics;
}
