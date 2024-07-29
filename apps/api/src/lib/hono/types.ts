import type {Key, Workspace} from '@formizee/db/schema';
import type {Pagination} from '@/lib/pagination';
import type {Services} from '@/lib/services';
import type {Limits} from '@formizee/plans';
import type {Env} from '@/lib/enviroment';

export type HonoVariables = {
  // Metrics
  requestId: string;
  userAgent: string;
  location: string;

  // Authentication
  workspace: Workspace;
  limits: Limits;
  key: Pick<Key, 'id' | 'name'>;

  // Context
  pagination: Pagination;
  services: Services;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: HonoVariables;
};
