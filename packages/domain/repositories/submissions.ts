import {type Response, type Submission} from '../models';
import {type Identifier} from '../models/values';

export interface SubmissionsRepository {
  loadAll: (endpoint: Identifier) => Promise<Response<Submission[]>>;
  load: (endpoint: Identifier, id: Identifier) => Promise<Response<Submission>>;
  save: (endpoint: Identifier, data: object) => Promise<Response<Submission>>;
  delete: (endpoint: Identifier, id: Identifier) => Promise<Response<true>>;

  updateIsSpam: (
    endpoint: Identifier,
    id: Identifier,
    isSpam: boolean
  ) => Promise<Response<Submission>>;

  updateIsRead: (
    endpoint: Identifier,
    id: Identifier,
    isRead: boolean
  ) => Promise<Response<Submission>>;
}
