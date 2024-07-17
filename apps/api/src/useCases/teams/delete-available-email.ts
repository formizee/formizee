import {resolve} from '@/lib/di';
import type {Response, Team} from 'domain/models';
import {Email, Name} from 'domain/models/values';

export class DeleteTeamAvailableEmail {
  private readonly _repository = resolve('teamsRepository');
  private readonly _team: Name;
  private readonly _email: Email;

  constructor(team: string, email: string) {
    this._email = new Email(email);
    this._team = new Name(team);
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.deleteAvailableEmail(this._team, this._email);
  }
}
