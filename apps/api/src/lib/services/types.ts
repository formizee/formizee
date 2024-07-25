import type {Analytics} from '@formizee/analytics';
import type {KeyService} from '@/services/keys';

export interface Services {
  keyService: KeyService;
  analytics: Analytics;
}
