import type {Pagination} from '@/lib/pagination';
import type {Services} from '@/lib/services';
import type {Env} from '@/lib/enviroment';

export type HonoVariables = {
  // Metrics
  requestStartedAt: number;
  isolateCreatedAt: number;
  isolateId: string;
  requestId: string;
  userAgent: string;
  location: string;

  // Context
  pagination: Pagination;
  services: Services;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: HonoVariables;
};
