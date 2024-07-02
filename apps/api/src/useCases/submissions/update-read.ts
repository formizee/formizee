import {type Response, type Submission} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateSubmissionIsRead {
  private readonly _repository = resolve('submissionsRepository');
  private readonly _isRead: boolean;
  private readonly _endpoint: Identifier;
  private readonly _id: Identifier;

  constructor(endpoint: string, id: string, isRead: boolean) {
    this._endpoint = new Identifier(endpoint);
    this._id = new Identifier(id);
    this._isRead = isRead;
  }

  async run(): Promise<Response<Submission>> {
    return await this._repository.updateIsRead(
      this._endpoint,
      this._id,
      this._isRead
    );
  }
}
