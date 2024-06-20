import type {UsersRepository as Repository} from 'domain/repositories';
import type {Identifier, Email, Name, Password} from 'domain/models/values';
import {Response, type User} from 'domain/models';
import bcryptjs from 'bcryptjs';
import {db, eq, users} from '@drizzle/db';
import {createUser} from '@/lib/utils';
import {AuthService} from '../services';

export class UsersRepository implements Repository {
  async load(uid: Identifier | Email): Promise<Response<User>> {
    const data = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!data) return Response.error('User not found.', 404);

    const user = createUser(data);
    return Response.success(user);
  }

  async delete(uid: Identifier, password: string): Promise<Response<true>> {
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

  async updateName(uid: Identifier, name: Name): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    if (user.name === name.value) {
      return Response.error(
        'The new name is already being used in this account.',
        409
      );
    }

    const data = await db
      .update(users)
      .set({name: name.value})
      .where(eq(users.id, uid.value))
      .returning({updatedName: users.name});
    if (!data[0]) return Response.error("User name can't be updated", 500);

    user.name = data[0].updatedName;
    const response = createUser(user);

    return Response.success(response);
  }

  async updateEmail(uid: Identifier, email: Email): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const emailExists = user.linkedEmails.some(
      linkedEmail => linkedEmail.email === email.value
    );
    if (!emailExists) {
      return Response.error(
        'The new email needs to be one of your linked emails.',
        401
      );
    }

    const verifiedEmail = user.linkedEmails.some(
      linkedEmail => linkedEmail.email === email.value && linkedEmail.isVerified
    );
    if (!verifiedEmail) {
      return Response.error(
        'The new email is not verified, please verify the email before using it',
        401
      );
    }

    const emailAlreadyUsed = email.value === user.email;
    if (emailAlreadyUsed) {
      return Response.error(
        'The new email is already being used in this account as default.',
        409
      );
    }

    const data = await db
      .update(users)
      .set({email: email.value})
      .where(eq(users.id, uid.value))
      .returning({updatedEmail: users.email});
    if (!data[0]) return Response.error("User email can't be updated", 500);

    user.email = data[0].updatedEmail;
    const response = createUser(user);

    return Response.success(response);
  }

  async updatePassword(uid: Identifier, password: Password): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const newPassword = await bcryptjs.hash(password.value, 13);

    const data = await db
      .update(users)
      .set({password: newPassword})
      .where(eq(users.id, uid.value))
      .returning({updatedPassword: users.password});
    if (!data[0]) return Response.error("User password can't be updated", 500);

    user.password = data[0].updatedPassword;
    const response = createUser(user);

    return Response.success(response);
  }

  async saveLinkedEmail(uid: Identifier, linkedEmail: Email): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const alreadyExists = user.linkedEmails.some(
      item => item.email === linkedEmail.value
    );
    if (alreadyExists) {
      return Response.error(
        'The user already has this email linked to it',
        409
      );
    }

    const limitExceeded = user.linkedEmails.length >= 3;
    if (limitExceeded) {
      return Response.error('You cannot add more than 3 linked emails', 403);
    }

    const linkedEmails = user.linkedEmails;
    linkedEmails.push({email: linkedEmail.value, isVerified: false});

    await db.update(users).set({linkedEmails}).where(eq(users.id, uid.value));
    user.linkedEmails = linkedEmails;

    const authService = new AuthService();
    await authService.sendLinkedEmailVerification(uid, linkedEmail);

    const response = createUser(user);
    return Response.success(response, 201);
  }

  async deleteLinkedEmail(
    uid: Identifier,
    linkedEmail: Email
  ): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const linkedEmailExists = user.linkedEmails.some(
      item => item.email === linkedEmail.value
    );
    if (!linkedEmailExists) {
      return Response.error('User linked email not found.', 404);
    }

    const isPrimaryEmail = user.email === linkedEmail.value;
    if (isPrimaryEmail) {
      return Response.error("You can't delete the primary email.", 401);
    }

    const linkedEmails = user.linkedEmails.filter(
      email => email.email !== linkedEmail.value
    );
    await db.update(users).set({linkedEmails}).where(eq(users.id, user.id));

    return Response.success(true);
  }
}
