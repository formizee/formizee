import {type Endpoint, type Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class AddEndpointTargetEmail {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _email: Email;

  constructor(id: string, email: string) {
    this._id = new Identifier(id);
    this._email = new Email(email);
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.addTargetEmail(
      this._id,
      this._email
    );
  }
}
