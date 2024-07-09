import type {Endpoint, Response} from '../models';
import type {Identifier, Email, Name} from '../models/values';

export interface EndpointsRepository {
  load: (endpointId: Identifier) => Promise<Response<Endpoint>>;
  loadAll: (team: Name) => Promise<Response<Endpoint[]>>;
  save: (
    name: string,
    team: Name,
    targetEmails: Email[]
  ) => Promise<Response<Endpoint>>;
  delete: (endpointId: Identifier) => Promise<Response<true>>;

  updateName: (
    endpointId: Identifier,
    name: string
  ) => Promise<Response<Endpoint>>;
  updateEnabled: (
    endpointId: Identifier,
    isEnabled: boolean
  ) => Promise<Response<Endpoint>>;
  updateRedirectUrl: (
    endpointId: Identifier,
    redirectUrl: URL
  ) => Promise<Response<Endpoint>>;
  updateEmailNotifications: (
    endpointId: Identifier,
    isEnabled: boolean
  ) => Promise<Response<Endpoint>>;

  updateTargetEmails: (
    endpointId: Identifier,
    targetEmails: Email[]
  ) => Promise<Response<Endpoint>>;
}
