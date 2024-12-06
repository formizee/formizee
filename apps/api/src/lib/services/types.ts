import type {ConsoleLogger} from '@formizee/logger';
import type {Analytics} from '@formizee/analytics';
import type {Metrics} from '@formizee/metrics';
import type {KeyService} from '@formizee/keys';
import type {Database} from '@formizee/db';
import type {Vault} from '@formizee/vault';
import type {Resend} from 'resend';

export interface Services {
  logger: ConsoleLogger;
  analytics: Analytics;
  apiKeys: KeyService;
  database: Database;
  metrics: Metrics;
  email: Resend;
  vault: Vault;
}
