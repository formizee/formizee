import {type Response, type Submission} from 'domain/models';
import {Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateSubmissionIsSpam {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _isSpam: boolean;
  private readonly _endpoint: Uid;
  private readonly _uid: Uid;

  constructor(endpoint: string, uid: string, isSpam: boolean) {
    this._endpoint = new Uid(endpoint);
    this._uid = new Uid(uid);
    this._isSpam = isSpam;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.update(
      this._endpoint,
      this._uid,
      this._isSpam
    );
  }
}
