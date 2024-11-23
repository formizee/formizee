import type {Analytics} from '@formizee/analytics';
import type {KeyService} from '@formizee/keys';
import type {Database} from '@formizee/db/api';
import type {Resend} from 'resend';

export interface Services {
  database: Database;
  analytics: Analytics;
  keyService: KeyService;
  emailService: Resend;
}
