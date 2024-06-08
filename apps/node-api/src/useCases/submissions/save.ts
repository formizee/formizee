import {type Response, type Submission} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _data: JSON;
  private readonly _endpoint: Uid;
  private readonly _files: string[] | undefined;

  constructor(endpoint: string, data: JSON, files?: string[]) {
    this._endpoint = new Uid(endpoint);
    this._files = files;
    this._data = data;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.save(this._endpoint, this._data, this._files);
  }
}
