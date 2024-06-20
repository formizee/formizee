import {type Response, type Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveSubmission {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _data: FormData;
  private readonly _form: Identifier;

  constructor(form: string, data: FormData) {
    this._form = new Identifier(form);
    this._data = data;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.save(this._form, this._data);
  }
}
