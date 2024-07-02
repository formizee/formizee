import {
  Identifier,
  type TeamRoles,
  type UserPermissions
} from 'domain/models/values';
import type {Team, Response} from 'domain/models';
import {resolve} from '@/lib/di';

export class SaveTeamMember {
  private readonly _repository = resolve('teamsRepository');
  private readonly _permissions: UserPermissions | undefined;
  private readonly _role: TeamRoles | undefined;
  private readonly _member: Identifier;
  private readonly _id: Identifier;

  constructor(
    id: string,
    member: string,
    permissions?: UserPermissions,
    role?: TeamRoles
  ) {
    this._member = new Identifier(member);
    this._id = new Identifier(id);
    this._permissions = permissions;
    this._role = role;
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.saveMember(
      this._id,
      this._member,
      this._permissions,
      this._role
    );
  }
}
