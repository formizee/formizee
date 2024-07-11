import {Identifier} from 'domain/models/values';
import {type Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class DeleteAPIKey {
  private readonly _service = resolve('apiKeysRepository');
  private readonly _apiKey: Identifier;
  private readonly _user: Identifier;

  constructor(apiKeyId: string, userId: string) {
    this._apiKey = new Identifier(apiKeyId);
    this._user = new Identifier(userId);
  }

  public async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._service.delete(this._apiKey, this._user);
  }
}
