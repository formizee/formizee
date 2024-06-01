import {type Response, type Submission} from '../models';
import {type Uid} from '../models/values';

export interface SubmissionsRepository {
  load: (uid: Uid) => Promise<Response<Submission>>;
  loadByForm: (form: Uid) => Promise<Response<Submission[]>>;
  save: (form: Uid, data: FormData) => Promise<Response<Submission>>;
  delete: (uid: Uid) => Promise<Response<void>>;
}
