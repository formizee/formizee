import {type Team, type Response} from 'domain/models';
import {Name, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class SaveTeam {
  private readonly _repository = resolve('teamsRepository');
  private readonly _ownerId: Identifier;
  private readonly _name: Name;

  constructor(ownerId: string, name: string) {
    this._ownerId = new Identifier(ownerId);
    this._name = new Name(name);
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.save(this._ownerId, this._name);
  }
}
