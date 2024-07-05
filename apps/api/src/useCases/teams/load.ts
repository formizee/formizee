import {type Team, type Response} from 'domain/models';
import {Name} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class LoadTeam {
  private readonly _repository = resolve('teamsRepository');
  private readonly _team: Name;

  constructor(team: string) {
    this._team = new Name(team);
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.load(this._team);
  }
}
