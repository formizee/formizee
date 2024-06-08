import {type Response, type Submission} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateSubmissionIsSpam {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _uid: Uid;
  private readonly _isSpam: boolean;

  constructor(endpoint: string, isSpam: boolean) {
    this._uid = new Uid(endpoint);
    this._isSpam = isSpam;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.update(this._uid, this._isSpam);
  }
}