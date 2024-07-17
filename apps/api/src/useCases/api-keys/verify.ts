import {resolve} from '@/lib/di';
import type {APIKey, Response} from 'domain/models';

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
