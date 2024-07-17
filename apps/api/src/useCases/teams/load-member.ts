import {resolve} from '@/lib/di';
import type {Member, Response} from 'domain/models';
import {Identifier, Name} from 'domain/models/values';

export class LoadTeamMember {
  private readonly _repository = resolve('teamsRepository');
  private readonly _member: Identifier;
  private readonly _team: Name;

  constructor(team: string, memberId: string) {
    this._member = new Identifier(memberId);
    this._team = new Name(team);
  }

  async run(): Promise<Response<Member>> {
    return await this._repository.loadMember(this._team, this._member);
  }
}
