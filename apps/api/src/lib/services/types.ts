import type {Analytics} from '@formizee/analytics';
import type {EmailService} from '@formizee/email';
import type {KeyService} from '@formizee/keys';
import type {Database} from '@formizee/db';

export interface Services {
  database: Database;
  analytics: Analytics;
  keyService: KeyService;
  emailService: EmailService;
}
