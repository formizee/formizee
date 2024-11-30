import type {Analytics} from '@formizee/analytics';
import type {Metrics} from '@formizee/metrics';
import type {KeyService} from '@formizee/keys';
import type {Database} from '@formizee/db';
import type {Resend} from 'resend';

export interface Services {
  analytics: Analytics;
  apiKeys: KeyService;
  database: Database;
  metrics: Metrics;
  email: Resend;
}
