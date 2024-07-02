import {type Endpoint, type Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveEndpoint {
  private readonly _repository = resolve('endpointsRepository');
  private readonly _name: string;
  private readonly _team: Identifier;
  private readonly _targetEmails: Email[] | undefined = [];

  constructor(name: string, team: string, targetEmails?: string[]) {
    this._name = name;
    this._team = new Identifier(team);
    this._targetEmails = targetEmails?.map(email => {
      return new Email(email);
    });
  }

  async run(): Promise<Response<Endpoint>> {
    return await this._repository.save(
      this._name,
      this._team,
      this._targetEmails
    );
  }
}
