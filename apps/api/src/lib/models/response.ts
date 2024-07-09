import shortUUID from 'short-uuid';
import type {z} from '@hono/zod-openapi';
import type {Endpoint, Member, Submission, Team, User} from 'domain/models';
import {
  UserSchema,
  EndpointSchema,
  SubmissionSchema,
  TeamSchema,
  MemberSchema
} from '@/schemas';

type UserResponse = z.infer<typeof UserSchema>;
type TeamResponse = z.infer<typeof TeamSchema>;
type MemberResponse = z.infer<typeof MemberSchema>;
type EndpointResponse = z.infer<typeof EndpointSchema>;
type SubmissionResponse = z.infer<typeof SubmissionSchema>;

export const userResponse = (data: User): UserResponse => {
  const id = shortUUID().fromUUID(data.id);

  const linkedEmails = data.linkedEmails.map(linkedEmail => {
    return {email: linkedEmail.email, isVerified: linkedEmail.isVerified};
  });

  const normalizedData = {
    id,
    name: data.name,
    email: data.email,
    isVerified: data.isVerified,
    linkedEmails,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  };

  return UserSchema.parse(normalizedData);
};

export const teamResponse = (data: Team): TeamResponse => {
  const id = shortUUID().fromUUID(data.id);

  const availableEmails = data.availableEmails.map(email => {
    return email.value;
  });

  const normalizedData = {
    id,
    name: data.name,
    plan: data.plan,
    availableEmails,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  };

  return TeamSchema.parse(normalizedData);
};

export const memberResponse = (data: Member): MemberResponse => {
  const id = shortUUID().fromUUID(data.id);

  const normalizedData = {
    id,
    role: data.role,
    permissions: data.permissions
  };

  return MemberSchema.parse(normalizedData);
};

export const endpointResponse = (data: Endpoint): EndpointResponse => {
  const id = shortUUID().fromUUID(data.id);
  const team = shortUUID().fromUUID(data.team);

  const targetEmails = data.targetEmails.map(email => email.value);

  const normalizedData = {
    id,
    name: data.name,
    team,
    isEnabled: data.isEnabled,
    emailNotifications: data.emailNotifications,
    redirectUrl: data.redirectUrl,
    targetEmails,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt
  };

  return EndpointSchema.parse(normalizedData);
};

export const submissionResponse = (data: Submission): SubmissionResponse => {
  const id = shortUUID().fromUUID(data.id);
  const endpoint = shortUUID().fromUUID(data.endpoint);

  const normalizedData = {
    id,
    endpoint,
    data: data.data,
    isSpam: data.isSpam,
    isRead: data.isRead,
    createdAt: data.createdAt
  };

  return SubmissionSchema.parse(normalizedData);
};
