import {type Response, type Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateSubmissionIsSpam {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _isSpam: boolean;
  private readonly _endpoint: Identifier;
  private readonly _uid: Identifier;

  constructor(endpoint: string, uid: string, isSpam: boolean) {
    this._endpoint = new Identifier(endpoint);
    this._uid = new Identifier(uid);
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
