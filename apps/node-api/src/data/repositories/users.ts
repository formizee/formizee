import type {UsersRepository as Repository} from 'domain/repositories';
import type {
  Uid,
  Email,
  Name,
  Password,
  LinkedEmail
} from 'domain/models/values';
import {Response, type User} from 'domain/models';
import bcryptjs from 'bcryptjs';
import {db, eq, users} from '@drizzle/db';
import {createUser} from '@/lib/utils';

export class UsersRepository implements Repository {
  async load(uid: Uid | Email): Promise<Response<User>> {
    const data = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!data) return Response.error('User not found.', 404);

    const user = createUser(data);
    return Response.success(user);
  }

  async delete(uid: Uid, password: string): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const authenticated = await bcryptjs.compare(password, user.password);

    if (!authenticated) {
      return Response.error('The password does not match.', 401);
    }

    await db.delete(users).where(eq(users.id, uid.value));

    return Response.success(true);
  }

  async updateName(uid: Uid, newName: Name): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const data = await db
      .update(users)
      .set({name: newName.value})
      .where(eq(users.id, uid.value))
      .returning({updatedName: users.name});
    if (!data[0]) return Response.error("User name can't be updated", 500);

    user.name = data[0].updatedName;
    const response = createUser(user);

    return Response.success(response);
  }

  async updateEmail(uid: Uid, newEmail: Email): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const alreadyExists = await db.query.users.findFirst({
      where: eq(users.email, newEmail.value)
    });
    if (!alreadyExists)
      return Response.error('The email is already taken by other user.', 409);

    const data = await db
      .update(users)
      .set({email: newEmail.value})
      .where(eq(users.id, uid.value))
      .returning({updatedEmail: users.email});
    if (!data[0]) return Response.error("User email can't be updated", 500);

    user.email = data[0].updatedEmail;
    const response = createUser(user);

    return Response.success(response);
  }

  async updatePassword(
    uid: Uid,
    newPassword: Password
  ): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const password = await bcryptjs.hash(newPassword.value, 13);

    const data = await db
      .update(users)
      .set({password})
      .where(eq(users.id, uid.value))
      .returning({updatedPassword: users.password});
    if (!data[0]) return Response.error("User password can't be updated", 500);

    user.password = data[0].updatedPassword;
    const response = createUser(user);

    return Response.success(response);
  }

  async updateLinkedEmails(
    uid: Uid,
    linkedEmails: LinkedEmail[]
  ): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const newLinkedEmails = linkedEmails.map(item => {
      return {email: item.email, isVerified: item.isVerified};
    });

    const data = await db
      .update(users)
      .set({linkedEmails: newLinkedEmails})
      .where(eq(users.id, uid.value))
      .returning({updatedLinkedEmails: users.linkedEmails});
    if (!data[0]) {
      return Response.error("User linked emails can't be updated", 500);
    }

    user.linkedEmails = data[0].updatedLinkedEmails;
    const response = createUser(user);

    return Response.success(response);
  }
}
