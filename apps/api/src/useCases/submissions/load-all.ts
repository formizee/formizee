import {resolve} from '@/lib/di';
import type {Response, Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';

export class LoadAllSubmissions {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _endpoint: Identifier;

  constructor(endpoint: string) {
    this._endpoint = new Identifier(endpoint);
  }

  async run(): Promise<Response<Submission[]>> {
    return await this._repository.loadAll(this._endpoint);
  }
}
