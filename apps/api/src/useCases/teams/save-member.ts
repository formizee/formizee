import {
  Name,
  Identifier,
  type TeamRoles,
  type UserPermissions
} from 'domain/models/values';
import type {Response, Member} from 'domain/models';
import {resolve} from '@/lib/di';

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
