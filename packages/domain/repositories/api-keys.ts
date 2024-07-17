import type {Response} from '../models';
import type {APIKey} from '../models/api-key';
import type {
  APIKeyExpirationDate,
  APIKeyScope,
  Identifier,
  Name
} from '../models/values';

export interface APIKeysRepository {
  save: (
    userId: Identifier,
    scope: APIKeyScope,
    expiresAt: APIKeyExpirationDate,
    teamSlug?: Name
  ) => Promise<Response<string>>;
  loadAll: (userId: Identifier) => Promise<Response<APIKey[]>>;
  verify: (apiKey: string) => Promise<Response<APIKey>>;
  delete: (apikeyId: Identifier, userId: Identifier) => Promise<Response<true>>;
}
