import {Identifier, UserPermissions, TeamRoles} from './values';

export class Member {
  private readonly _id: Identifier;
  private readonly _role: TeamRoles;
  private readonly _permissions: UserPermissions;

  constructor(id: string, role: TeamRoles, permissions: UserPermissions) {
    this._id = new Identifier(id);
    this._role = role;
    this._permissions = permissions;
  }

  get id(): string {
    return this._id.value;
  }

  get role(): TeamRoles {
    return this._role;
  }

  get permissions(): UserPermissions {
    return this._permissions;
  }
}
