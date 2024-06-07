import type {Endpoint, Response} from '../models';
import type {Uid, Email} from '../models/values';

export interface EndpointsRepository {
  loadAll: (owner: Uid) => Promise<Response<Endpoint[]>>;
  load: (uid: Uid) => Promise<Response<Endpoint>>;
  save: (name: string, owner: Uid) => Promise<Response<Endpoint>>;
  delete: (uid: Uid) => Promise<Response<void>>;
  updateEnabled: (uid: Uid, isEnabled: boolean) => Promise<Response<void>>;
  updateRedirectUrl: (uid: Uid, redirectUrl: URL) => Promise<Response<void>>;
  updateTargetEmail: (uid: Uid, targetEmail: Email) => Promise<Response<void>>;
  updateEmailNotifications: (
    uid: Uid,
    isEnabled: boolean
  ) => Promise<Response<void>>;
}
