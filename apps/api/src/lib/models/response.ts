import shortUUID from 'short-uuid';
import type {User} from 'domain/models';
import type {z} from '@hono/zod-openapi';
import {UserSchema} from '@/schemas';

type UserResponse = z.infer<typeof UserSchema>;

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
