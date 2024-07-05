import type {
  Email,
  Identifier,
  Name,
  TeamRoles,
  UserPermissions
} from '../models/values';
import type {Member, Response, Team} from '../models';

export interface TeamsRepository {
  save: (ownerId: Identifier, name: Name) => Promise<Response<Team>>;
  load: (team: Name) => Promise<Response<Team>>;
  delete: (team: Name) => Promise<Response<true>>;

  saveAvailableEmail: (team: Name, email: Email) => Promise<Response<Team>>;
  deleteAvailableEmail: (team: Name, email: Email) => Promise<Response<Team>>;

  loadMember: (team: Name, memberId: Identifier) => Promise<Response<Member>>;
  loadMembers: (team: Name) => Promise<Response<Member[]>>;
  saveMember: (
    team: Name,
    userId: Identifier,
    permissions?: UserPermissions,
    role?: TeamRoles
  ) => Promise<Response<Member>>;
  deleteMember: (team: Name, memberId: Identifier) => Promise<Response<true>>;

  updateMemberPermissions: (
    team: Name,
    memberId: Identifier,
    permissions: UserPermissions
  ) => Promise<Response<Member>>;
  updateMemberRole: (
    team: Name,
    memberId: Identifier,
    role: TeamRoles
  ) => Promise<Response<Member>>;
}
