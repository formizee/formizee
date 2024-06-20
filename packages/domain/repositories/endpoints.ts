import type {Endpoint, Response} from '../models';
import type {Identifier, Email} from '../models/values';

export interface EndpointsRepository {
  load: (uid: Identifier) => Promise<Response<Endpoint>>;
  loadAll: (owner: Identifier) => Promise<Response<Endpoint[]>>;
  save: (name: string, owner: Identifier) => Promise<Response<Endpoint>>;
  delete: (uid: Identifier) => Promise<Response<true>>;

  updateName: (uid: Identifier, name: string) => Promise<Response<Endpoint>>;
  updateEnabled: (uid: Identifier, isEnabled: boolean) => Promise<Response<Endpoint>>;
  updateRedirectUrl: (
    uid: Identifier,
    redirectUrl: URL
  ) => Promise<Response<Endpoint>>;
  updateTargetEmail: (
    uid: Identifier,
    targetEmail: Email
  ) => Promise<Response<Endpoint>>;
  updateEmailNotifications: (
    uid: Identifier,
    isEnabled: boolean
  ) => Promise<Response<Endpoint>>;
}
