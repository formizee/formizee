import {resolve} from '@/lib/di';
import type {Response, Team} from 'domain/models';
import {Name} from 'domain/models/values';

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
