import type {Response, Team} from '../models';
import type {Email, Identifier} from '../models/values';

export interface TeamsRepository {
  save: (owner: Identifier, name: string) => Promise<Response<Team>>;
  load: (id: Identifier) => Promise<Response<Team>>;
  delete: (id: Identifier) => Promise<Response<true>>;
  updateAvailableEmails: (
    id: Identifier,
    availableEmails: Email[]
  ) => Promise<Response<Team>>;
}
