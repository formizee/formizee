import {resolve} from '@/lib/di';
import type {Response} from 'domain/models';
import {Identifier, Name} from 'domain/models/values';

export class DeleteTeamMember {
  private readonly _repository = resolve('teamsRepository');
  private readonly _memberId: Identifier;
  private readonly _team: Name;

  constructor(id: string, memberId: string) {
    this._memberId = new Identifier(memberId);
    this._team = new Name(id);
  }

  async run(): Promise<Response<true>> {
    return await this._repository.deleteMember(this._team, this._memberId);
  }
}
