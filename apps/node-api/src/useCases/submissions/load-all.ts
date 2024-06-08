import {type Response, type Submission} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadAllSubmissions {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _endpoint: Uid;

  constructor(endpoint: string) {
    this._endpoint = new Uid(endpoint);
  }

  async run(): Promise<Response<Submission[]>> {
    return await this._repository.loadAll(this._endpoint);
  }
}
