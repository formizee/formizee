import type {Pagination} from '@/lib/pagination';
import type {Limits} from '@formizee/plans';
import type {Services} from '@/services';
import type {schema} from '@formizee/db';
import type {Env} from 'hono';

export type HonoVariables = {
  // Authentication
  limits: Limits;
  user: schema.User;
  workspace: schema.Workspace;

  // Context
  services: Services;
  pagination: Pagination;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: HonoVariables;
};
