import type {ContentType} from '@/lib/middlewares/body/utils';
import type {Pagination} from '@/lib/pagination';
import type {Services} from '@/lib/services';
import type {Limits} from '@formizee/plans';
import type {Env} from '@/lib/enviroment';
import type {schema} from '@formizee/db';

interface PostSubmissionBody {
  data: Record<string, string>;
  fileUploads: {field: string; file: File}[];
}

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
  bodyContentType: ContentType;
  body: PostSubmissionBody;
  pagination: Pagination;
  services: Services;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: HonoVariables;
};
