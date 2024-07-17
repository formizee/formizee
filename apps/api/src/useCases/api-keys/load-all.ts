import {resolve} from '@/lib/di';
import type {APIKey, Response} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class LoadAllAPIKeys {
  private readonly _service = resolve('apiKeysRepository');
  private readonly _user: Identifier;

  constructor(userId: string) {
    this._user = new Identifier(userId);
  }

  public async run(): Promise<Response<APIKey[]>> {
    return await this._service.loadAll(this._user);
  }
}
