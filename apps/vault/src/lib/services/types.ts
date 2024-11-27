import type {Database} from '@formizee/db-submissions/vault';
import type {Analytics} from '@formizee/analytics';
import type {Storage} from '@formizee/storage';
import type {Cache} from '@/lib/cache';
import type {Keys} from '@/lib/keys';

export interface Services {
  analytics: Analytics;
  database: Database;
  storage: Storage;
  cache: Cache;
  keys: Keys;
}
