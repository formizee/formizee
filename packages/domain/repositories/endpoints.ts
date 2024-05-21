import type {Endpoint, Submission, Response} from '@/models';
import type {Uid, Email, Name} from '@/models/values';

export interface EndpointsRepository {
  delete: (uid: Uid) => Promise<Response<void>>;
  load: (uid: Uid) => Promise<Response<Endpoint>>;
  loadByOwner: (owner: Uid) => Promise<Response<Endpoint[]>>;
  save: (name: Name, owner: Uid) => Promise<Response<Endpoint>>;
  updateEnabled: (uid: Uid, isEnabled: boolean) => Promise<Response<void>>;
  updateRedirectUrl: (uid: Uid, redirectUrl: URL) => Promise<Response<void>>;
  updateTargetEmail: (uid: Uid, targetEmail: Email) => Promise<Response<void>>;
  addSubmission: (uid: Uid, submission: Submission) => Promise<Response<Submission>>;
  updateEmailNotifications: ( uid: Uid, isEnabled: boolean) => Promise<Response<void>>;
}
