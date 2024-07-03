import type {Endpoint, Response} from '../models';
import type {Identifier, Email} from '../models/values';

export interface EndpointsRepository {
  load: (id: Identifier) => Promise<Response<Endpoint>>;
  loadAll: (team: Identifier) => Promise<Response<Endpoint[]>>;
  save: (
    name: string,
    team: Identifier,
    targetEmails?: Email[]
  ) => Promise<Response<Endpoint>>;
  delete: (id: Identifier) => Promise<Response<true>>;

  updateName: (id: Identifier, name: string) => Promise<Response<Endpoint>>;
  updateEnabled: (
    id: Identifier,
    isEnabled: boolean
  ) => Promise<Response<Endpoint>>;
  updateRedirectUrl: (
    id: Identifier,
    redirectUrl: URL
  ) => Promise<Response<Endpoint>>;
  updateEmailNotifications: (
    id: Identifier,
    isEnabled: boolean
  ) => Promise<Response<Endpoint>>;

  updateTargetEmails: (
    id: Identifier,
    targetEmails: Email[]
  ) => Promise<Response<Endpoint>>;
}
