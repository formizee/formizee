import {type Endpoint, type Response} from 'domain/models';
import {Email, Uid} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _name: string;
  private readonly _owner: Uid;
  private readonly _targetEmail: Email;

  constructor(name: string, owner: string, targetEmail: string) {
    this._name = name;
    this._owner = new Uid(owner);
    this._targetEmail = new Email(targetEmail);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.save(
      this._name,
      this._owner,
      this._targetEmail
    );
  }
}
