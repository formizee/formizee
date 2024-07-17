import {resolve} from '@/lib/di';
import type {Response} from 'domain/models';
import {
  type APIKeyExpirationDate,
  type APIKeyScope,
  Identifier,
  Name
} from 'domain/models/values';

export class SaveAPIKey {
  private readonly _service = resolve('apiKeysRepository');
  private readonly _team: Name | undefined = undefined;
  private readonly _expiresAt: APIKeyExpirationDate;
  private readonly _scope: APIKeyScope;
  private readonly _user: Identifier;

  constructor(
    userId: string,
    scope: APIKeyScope,
    expiresAt: APIKeyExpirationDate,
    teamSlug?: string
  ) {
    if (teamSlug) {
      this._team = new Name(teamSlug);
    }
    this._user = new Identifier(userId);
    this._expiresAt = expiresAt;
    this._scope = scope;
  }

  public async run(): Promise<Response<string>> {
    return await this._service.save(
      this._user,
      this._scope,
      this._expiresAt,
      this._team
    );
  }
}
