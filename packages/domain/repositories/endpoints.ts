import type {Endpoint, Submission} from '@/models';
import type {Uid, Email} from '@/models/values';

export interface EndpointsRepository {
  delete: (uid: Uid) => Promise<void>;
  get: (uid: Uid) => Promise<Endpoint>;
  create: (uid: Uid, owner: Uid) => Promise<Endpoint>;
  setEnabled: (uid: Uid, isEnabled: boolean) => Promise<void>;
  setRedirectUrl: (uid: Uid, redirectUrl: URL) => Promise<void>;
  setTargetEmail: (uid: Uid, targetEmail: Email) => Promise<void>;
  addSubmission: (uid: Uid, submission: Submission) => Promise<void>;
  setEmailNotifications: (uid: Uid, emailNotifications: boolean) => Promise<void>;
}
