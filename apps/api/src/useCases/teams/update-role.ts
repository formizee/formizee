import {resolve} from '@/lib/di';
import type {Member, Response} from 'domain/models';
import {Identifier, Name, type TeamRoles} from 'domain/models/values';

export class UpdateTeamMemberRole {
  private readonly _repository = resolve('teamsRepository');
  private readonly _role: TeamRoles;
  private readonly _memberId: Identifier;
  private readonly _team: Name;

  constructor(team: string, memberId: string, role: TeamRoles) {
    this._memberId = new Identifier(memberId);
    this._team = new Name(team);
    this._role = role;
  }

  async run(): Promise<Response<Member>> {
    return await this._repository.updateMemberRole(
      this._team,
      this._memberId,
      this._role
    );
  }
}
