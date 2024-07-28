import type {Analytics} from '@formizee/analytics';
import type {EmailService} from '@formizee/email';
import type {KeyService} from '@formizee/keys';

export interface Services {
  analytics: Analytics;
  keyService: KeyService;
  emailService: EmailService;
}
