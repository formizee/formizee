import {type Team, type Response} from 'domain/models';
import {Email, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveTeamAvailableEmail {
  private readonly _repository = resolve('teamsRepository');
  private readonly _id: Identifier;
  private readonly _email: Email;

  constructor(id: string, email: string) {
    this._email = new Email(email);
    this._id = new Identifier(id);
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.saveAvailableEmail(this._id, this._email);
  }
}
