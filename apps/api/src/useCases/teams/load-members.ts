import {type Response, type Member} from 'domain/models';
import {Name} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadTeamMembers {
  private readonly _repository = resolve('teamsRepository');
  private readonly _team: Name;

  constructor(team: string) {
    this._team = new Name(team);
  }

  async run(): Promise<Response<Member[]>> {
    return await this._repository.loadMembers(this._team);
  }
}
