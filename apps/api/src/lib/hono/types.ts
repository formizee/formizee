import type {Limits} from '@formizee/plans';
import type {schema} from '@formizee/db';

export type HonoVariables = {
  limits: Limits;
  user: schema.User;
  workspace: schema.Workspace;
};
