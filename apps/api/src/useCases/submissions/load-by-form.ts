import {Response, Submission} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadSubmissionByForm {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _uid: Uid;

  constructor(form: string) {
    this._uid = new Uid(form);
  }

  async run(): Promise<Response<Submission[]>> {
    return await this._repository.loadByForm(this._uid);
  }
}
