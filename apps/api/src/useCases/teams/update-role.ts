import {Identifier, type TeamRoles} from 'domain/models/values';
import type {Team, Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class UpdateTeamMemberRole {
  private readonly _repository = resolve('teamsRepository');
  private readonly _role: TeamRoles;
  private readonly _member: Identifier;
  private readonly _id: Identifier;

  constructor(id: string, member: string, role: TeamRoles) {
    this._member = new Identifier(member);
    this._id = new Identifier(id);
    this._role = role;
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.updateMemberRole(
      this._id,
      this._member,
      this._role
    );
  }
}
