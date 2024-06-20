import {type Response, type Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _endpoint: Identifier;
  private readonly _data: object;

  constructor(endpoint: string, data: object) {
    this._endpoint = new Identifier(endpoint);
    this._data = data;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.save(this._endpoint, this._data);
  }
}
