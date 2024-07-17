import {resolve} from '@/lib/di';
import type {Response} from 'domain/models';
import {Name} from 'domain/models/values';

export class DeleteTeam {
  private readonly _repository = resolve('teamsRepository');
  private readonly _team: Name;

  constructor(team: string) {
    this._team = new Name(team);
  }

  async run(): Promise<Response<true>> {
    //eslint-disable-next-line -- Drizzle eslint plugin mistake
    return await this._repository.delete(this._team);
  }
}
