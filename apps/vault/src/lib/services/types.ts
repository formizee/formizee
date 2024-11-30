import type {Database} from '@formizee/db/submissions';
import type {ConsoleLogger} from '@formizee/logger';
import type {Analytics} from '@formizee/analytics';
import type {Storage} from '@formizee/storage';
import type {Cache} from '@/lib/cache';
import type {Keys} from '@/lib/keys';

export interface Services {
  logger: ConsoleLogger;
  analytics: Analytics;
  database: Database;
  storage: Storage;
  cache: Cache;
  keys: Keys;
}
