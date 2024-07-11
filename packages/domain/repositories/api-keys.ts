import type {
  Identifier,
  APIKeyScope,
  Name,
  APIKeyExpirationDate
} from '../models/values';
import type {APIKey} from '../models/api-key';
import type {Response} from '../models';

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
