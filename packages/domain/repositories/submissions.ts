import {type Response, type Submission} from '../models';
import {type Identifier} from '../models/values';

export interface SubmissionsRepository {
  loadAll: (endpoint: Identifier) => Promise<Response<Submission[]>>;
  load: (endpoint: Identifier, uid: Identifier) => Promise<Response<Submission>>;
  update: (
    endpoint: Identifier,
    uid: Identifier,
    isSpam: boolean
  ) => Promise<Response<Submission>>;
  save: (endpoint: Identifier, data: object) => Promise<Response<Submission>>;
  delete: (endpoint: Identifier, uid: Identifier) => Promise<Response<true>>;
}
