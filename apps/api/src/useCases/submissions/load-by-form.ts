import {type Response, type Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadSubmissionByForm {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _uid: Identifier;

  constructor(form: string) {
    this._uid = new Identifier(form);
  }

  async run(): Promise<Response<Submission[]>> {
    return await this._repository.loadByForm(this._uid);
  }
}
