import {resolve} from '@/lib/di';
import type {Response, Team} from 'domain/models';
import {Identifier, Name} from 'domain/models/values';

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
