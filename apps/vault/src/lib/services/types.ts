import type {Database} from '@formizee/db/submissions';
import type {ConsoleLogger} from '@formizee/logger';
import type {Metrics} from '@formizee/metrics';
import type {Storage} from '@formizee/storage';
import type {Cache} from '@/lib/cache';
import type {Keys} from '@/lib/keys';

export interface Services {
  logger: ConsoleLogger;
  database: Database;
  metrics: Metrics;
  storage: Storage;
  cache: Cache;
  keys: Keys;
}
