import {type Response, type Submission} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _data: FormData;
  private readonly _form: Uid;

  constructor(form: string, data: FormData) {
    this._form = new Uid(form);
    this._data = data;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.save(this._form, this._data);
  }
}
