import type {EmailClient} from '@formizee/email/client';
import type {ConsoleLogger} from '@formizee/logger';
import type {Analytics} from '@formizee/analytics';
import type {Metrics} from '@formizee/metrics';
import type {KeyService} from '@formizee/keys';
import type {Database} from '@formizee/db';
import type {Vault} from '@formizee/vault';

export interface Services {
  logger: ConsoleLogger;
  analytics: Analytics;
  apiKeys: KeyService;
  database: Database;
  metrics: Metrics;
  email: EmailClient;
  vault: Vault;
}
