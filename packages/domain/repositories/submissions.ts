import type {Response, Submission} from '../models';
import type {Identifier} from '../models/values';

export interface SubmissionsRepository {
  loadAll: (endpointId: Identifier) => Promise<Response<Submission[]>>;
  load: (
    endpointId: Identifier,
    submissionId: Identifier
  ) => Promise<Response<Submission>>;
  save: (endpointId: Identifier, data: object) => Promise<Response<Submission>>;
  delete: (
    endpointId: Identifier,
    submissionId: Identifier
  ) => Promise<Response<true>>;

  updateIsSpam: (
    endpointId: Identifier,
    submissionId: Identifier,
    isSpam: boolean
  ) => Promise<Response<Submission>>;

  updateIsRead: (
    endpointId: Identifier,
    submissionId: Identifier,
    isRead: boolean
  ) => Promise<Response<Submission>>;
}
