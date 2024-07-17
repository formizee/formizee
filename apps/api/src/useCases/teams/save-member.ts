import {resolve} from '@/lib/di';
import type {Member, Response} from 'domain/models';
import {
  Identifier,
  Name,
  type TeamRoles,
  type UserPermissions
} from 'domain/models/values';

export class SaveTeamMember {
  private readonly _repository = resolve('teamsRepository');
  private readonly _permissions: UserPermissions | undefined;
  private readonly _role: TeamRoles | undefined;
  private readonly _memberId: Identifier;
  private readonly _team: Name;

  constructor(
    team: string,
    member: string,
    permissions?: UserPermissions,
    role?: TeamRoles
  ) {
    this._memberId = new Identifier(member);
    this._team = new Name(team);
    this._permissions = permissions;
    this._role = role;
  }

  async run(): Promise<Response<Member>> {
    return await this._repository.saveMember(
      this._team,
      this._memberId,
      this._permissions,
      this._role
    );
  }
}
