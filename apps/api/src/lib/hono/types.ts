import type {schema} from '@formizee/db';
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
  workspace: schema.Workspace;
  limits: Limits;
  key: Pick<schema.Key, 'id' | 'name'>;

  // Context
  pagination: Pagination;
  services: Services;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: HonoVariables;
};
