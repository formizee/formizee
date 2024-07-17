import {APIKey, Endpoint, Member, Submission, Team, User} from 'domain/models';
import type {
  APIKeyScope,
  Color,
  Icon,
  LinkedEmail,
  TeamPlan,
  TeamRoles,
  UserPermissions
} from 'domain/models/values';
import shortUUID from 'short-uuid';

export const createUser = (data: {
  id: string;
  name: string;
  email: string;
  linkedEmails: LinkedEmail[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): User => {
  const emails = data.linkedEmails.map(item => {
    return {email: item.email, isVerified: item.isVerified};
  });

  return new User(
    data.id,
    data.name,
    data.email,
    data.isVerified,
    emails,
    data.createdAt,
    data.updatedAt
  );
};

export const createTeam = (data: {
  id: string;
  name: string;
  plan: TeamPlan;
  availableEmails: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}): Team => {
  return new Team(
    data.id,
    data.name,
    data.plan,
    data.availableEmails,
    data.createdAt,
    data.updatedAt,
    data.createdBy
  );
};

export const createMember = (data: {
  user: string;
  permissions: UserPermissions;
  role: TeamRoles;
}): Member => {
  return new Member(data.user, data.role, data.permissions);
};

export const createEndpoint = (data: {
  id: string;
  name: string;
  team: string;
  targetEmails: string[];
  redirectUrl: string;
  isEnabled: boolean;
  emailNotifications: boolean;
  color: Color;
  icon: Icon;
  createdAt: Date;
  updatedAt: Date;
}): Endpoint => {
  return new Endpoint(
    data.id,
    data.name,
    data.team,
    data.targetEmails,
    data.redirectUrl,
    data.isEnabled,
    data.emailNotifications,
    data.color,
    data.icon,
    data.createdAt,
    data.updatedAt
  );
};

export const createSubmission = (data: {
  id: string;
  endpoint: string;
  data: object;
  isSpam: boolean;
  isRead: boolean;
  createdAt: Date;
}): Submission => {
  return new Submission(
    data.id,
    data.endpoint,
    data.data,
    data.isSpam,
    data.isRead,
    data.createdAt
  );
};

export const createAPIKey = (data: {
  id: string;
  user: string;
  team: string | null;
  scope: APIKeyScope;
  lastAccess: Date;
  expiresAt: Date;
  createdAt: Date;
}): APIKey => {
  return new APIKey(
    data.id,
    data.scope,
    data.user,
    data.lastAccess,
    data.expiresAt,
    data.createdAt,
    data.team ?? undefined
  );
};

export const createUUID = (identifier: string): string => {
  return shortUUID().toUUID(identifier);
};
