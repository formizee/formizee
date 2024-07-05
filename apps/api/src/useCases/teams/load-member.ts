import {type Response, type Member} from 'domain/models';
import {Name, Identifier} from 'domain/models/values';
import {resolve} from '@/lib/di';

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
