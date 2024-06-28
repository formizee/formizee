import type {Response, Team} from '../models';
import type {Email, Identifier} from '../models/values';
import {TeamRoles, UserPermissions} from '../models/values';

export interface TeamsRepository {
  save: (owner: Identifier, name: string) => Promise<Response<Team>>;
  load: (id: Identifier) => Promise<Response<Team>>;
  delete: (id: Identifier) => Promise<Response<true>>;

  saveMember: (
    id: Identifier,
    member: Identifier,
    permissions?: UserPermissions,
    role?: TeamRoles
  ) => Promise<Response<Team>>;
  deleteMember: (id: Identifier, member: Identifier) => Promise<Response<true>>;

  updateAvailableEmails: (
    id: Identifier,
    availableEmails: Email[]
  ) => Promise<Response<Team>>;

  updateMemberPermissions: (
    id: Identifier,
    member: Identifier,
    permissions: UserPermissions
  ) => Promise<Response<Team>>;
  updateMemberRole: (
    id: Identifier,
    member: Identifier,
    role: TeamRoles
  ) => Promise<Response<Team>>;
}
