import {type Response, type Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateSubmissionIsSpam {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _isSpam: boolean;
  private readonly _endpoint: Identifier;
  private readonly _id: Identifier;

  constructor(endpoint: string, id: string, isSpam: boolean) {
    this._endpoint = new Identifier(endpoint);
    this._id = new Identifier(id);
    this._isSpam = isSpam;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.updateIsSpam(
      this._endpoint,
      this._id,
      this._isSpam
    );
  }
}
