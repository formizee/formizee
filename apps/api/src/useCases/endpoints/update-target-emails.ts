import {type Endpoint, type Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateEndpointTargetEmails {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _id: Identifier;
  private readonly _emails: Email[];

  constructor(id: string, emails: string[]) {
    this._id = new Identifier(id);
    this._emails = emails.map(email => {
      return new Email(email);
    });
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.updateTargetEmails(this._id, this._emails);
  }
}
