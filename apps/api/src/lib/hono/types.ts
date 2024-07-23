import type {Limits} from '@formizee/plans';
import type {KeyService} from '@/services';
import type {schema} from '@formizee/db';
import type {Env} from 'hono';

interface ServiceContext {
  keyService: KeyService;
}

export type HonoVariables = {
  limits: Limits;
  user: schema.User;
  workspace: schema.Workspace;
  services: ServiceContext;
};

export type HonoEnv = {
  Bindings: Env;
  Variables: HonoVariables;
};
