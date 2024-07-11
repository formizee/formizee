import {type Response, type APIKey} from 'domain/models';
import {resolve} from '@/lib/di';

export class VerifyAPIKey {
  private readonly _service = resolve('apiKeysRepository');
  private readonly _apiKey: string;

  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  public async run(): Promise<Response<APIKey>> {
    return await this._service.verify(this._apiKey);
  }
}
