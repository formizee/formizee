import {Response, Team} from '../models';
import {Email, Identifier} from '../models/values';

export interface TeamsRepository {
  save(name: string): Promise<Response<Team>>;
  load(id: Identifier): Promise<Response<Team>>;
  delete(id: Identifier): Promise<Response<Team>>;
  updateAvailableEmails(availableEmails: Email[]): Promise<Response<Team>>;
}
