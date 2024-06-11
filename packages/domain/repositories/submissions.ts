import {type Response, type Submission} from '../models';
import {type Uid} from '../models/values';

export interface SubmissionsRepository {
  loadAll: (endpoint: Uid) => Promise<Response<Submission[]>>;
  load: (endpoint: Uid, uid: Uid) => Promise<Response<Submission>>;
  update: (uid: Uid, isSpam: boolean) => Promise<Response<Submission>>;
  save: (
    endpoint: Uid,
    data: JSON,
    files?: string[]
  ) => Promise<Response<Submission>>;
  delete: (uid: Uid) => Promise<Response<true>>;
}
