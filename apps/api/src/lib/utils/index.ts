import {Endpoint, Submission, Team, TeamPlan, User} from 'domain/models';

export const createTeam = (data: {
  id: string;
  name: string;
  plan: TeamPlan;
  availableEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}): Team => {
  return new Team(
    data.id,
    data.name,
    data.plan,
    data.availableEmails,
    data.createdAt,
    data.updatedAt
  );
};

export const createEndpoint = (data: {
  id: string;
  name: string;
  team: string;
  targetEmails: string[];
  redirectUrl: string;
  isEnabled: boolean;
  emailNotifications: boolean;
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

export const createUser = (
  data: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  },
  linkedEmails: {email: string; isVerified: boolean}[]
): User => {
  const emails = linkedEmails.map(item => {
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
