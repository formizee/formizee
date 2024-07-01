import {type Team, type Response} from 'domain/models';
import {Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveTeam {
  private readonly _repository = resolve('teamsRepository');
  private readonly _owner: Identifier;
  private readonly _name: string;

  constructor(owner: string, name: string) {
    this._owner = new Identifier(owner);
    this._name = name;
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.save(this._owner, this._name);
  }
}
