import {type Endpoint, type Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointTargetEmail {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _uid: Identifier;
  private readonly _targetEmail: Email;

  constructor(uid: string, targetEmail: string) {
    this._uid = new Identifier(uid);
    this._targetEmail = new Email(targetEmail);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateTargetEmail(
      this._uid,
      this._targetEmail
    );
  }
}
