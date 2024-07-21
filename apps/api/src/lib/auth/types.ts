import type {schema} from '@formizee/db';
import type {Limits} from '@formizee/plans';

export interface AuthContext {
  limits: Limits;
  user: schema.User;
  workspace: schema.Workspace;
}
