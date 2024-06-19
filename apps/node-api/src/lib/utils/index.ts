import {Endpoint, Submission, User} from 'domain/models';

export const createUser = (data: {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  forms: string[];
  linkedEmails: {email: string; isVerified: boolean}[];
  permission: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}): User => {
  return new User(
    data.id,
    data.name,
    data.email,
    data.isVerified,
    data.permission,
    data.createdAt,
    data.updatedAt,
    data.forms,
    data.linkedEmails
  );
};

export const createEndpoint = (data: {
  id: string;
  name: string;
  owner: string;
  targetEmail: string;
  redirectUrl: string;
  isEnabled: boolean;
  emailNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Endpoint => {
  return new Endpoint(
    data.id,
    data.name,
    data.owner,
    data.targetEmail,
    data.redirectUrl,
    data.isEnabled,
    data.emailNotifications,
    data.createdAt,
    data.updatedAt
  );
};

export const createSubmission = (data: {
  id: number;
  endpoint: string;
  data: object;
  createdAt: Date;
  isSpam: boolean;
}): Submission => {
  return new Submission(
    data.id.toString(),
    data.endpoint,
    data.data,
    data.createdAt,
    data.isSpam
  );
};
