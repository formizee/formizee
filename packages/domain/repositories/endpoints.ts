import type {Endpoint, Response} from '../models';
import type {Uid, Email} from '../models/values';

export interface EndpointsRepository {
  load: (uid: Uid) => Promise<Response<Endpoint>>;
  loadAll: (owner: Uid) => Promise<Response<Endpoint[]>>;
  save: (name: string, owner: Uid) => Promise<Response<Endpoint>>;
  delete: (uid: Uid) => Promise<Response<true>>;

  updateName: (uid: Uid, name: string) => Promise<Response<Endpoint>>;
  updateEnabled: (uid: Uid, isEnabled: boolean) => Promise<Response<Endpoint>>;
  updateRedirectUrl: (
    uid: Uid,
    redirectUrl: URL
  ) => Promise<Response<Endpoint>>;
  updateTargetEmail: (
    uid: Uid,
    targetEmail: Email
  ) => Promise<Response<Endpoint>>;
  updateEmailNotifications: (
    uid: Uid,
    isEnabled: boolean
  ) => Promise<Response<Endpoint>>;
}
