import {resolve} from '@/lib/di';
import type {Member, Response} from 'domain/models';
import {Identifier, Name, type UserPermissions} from 'domain/models/values';

export class UpdateTeamMemberPermissions {
  private readonly _repository = resolve('teamsRepository');
  private readonly _permissions: UserPermissions;
  private readonly _memberId: Identifier;
  private readonly _team: Name;

  constructor(team: string, memberId: string, permissions: UserPermissions) {
    this._memberId = new Identifier(memberId);
    this._team = new Name(team);
    this._permissions = permissions;
  }

  async run(): Promise<Response<Member>> {
    return await this._repository.updateMemberPermissions(
      this._team,
      this._memberId,
      this._permissions
    );
  }
}
