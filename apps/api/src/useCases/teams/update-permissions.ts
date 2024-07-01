import {Team, type Response} from 'domain/models';
import {Identifier, UserPermissions} from 'domain/models/values';
import {resolve} from '@/lib/di';

export class UpdateTeamMemberPermissions {
  private readonly _repository = resolve('teamsRepository');
  private readonly _permissions: UserPermissions;
  private readonly _member: Identifier;
  private readonly _id: Identifier;

  constructor(id: string, member: string, permissions: UserPermissions) {
    this._member = new Identifier(member);
    this._id = new Identifier(id);
    this._permissions = permissions;
  }

  async run(): Promise<Response<Team>> {
    return await this._repository.updateMemberPermissions(
      this._id,
      this._member,
      this._permissions
    );
  }
}
