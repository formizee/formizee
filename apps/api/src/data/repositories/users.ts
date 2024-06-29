import type {UsersRepository as Repository} from 'domain/repositories';
import type {Identifier, Email, Name, Password} from 'domain/models/values';
import {Response, Team, type User} from 'domain/models';
import bcryptjs from 'bcryptjs';
import {db, eq, users, linkedEmails, members} from '@drizzle/db';
import {createTeam, createUser} from 'src/lib/models';
import {AuthService} from '../services';

export class UsersRepository implements Repository {
  async load(id: Identifier | Email): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value),
      with: {linkedEmails: true}
    });
    if (!user) return Response.error('User not found.', 404);

    const response = createUser(user);
    return Response.success(response);
  }

  async loadLinkedTeams(id: Identifier): Promise<Response<Team[]>> {
    const data = await db.query.members.findMany({
      where: eq(members.user, id.value),
      with: {team: true}
    });
    if (!data[0]) return Response.error('User not found.', 404);

    const response = data.map(item => {
      return createTeam(item.team);
    });
    return Response.success(response);
  }

  async delete(id: Identifier, password: string): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value)
    });
    if (!user) return Response.error('User not found.', 404);

    const authenticated = await bcryptjs.compare(password, user.password);

    if (!authenticated) {
      return Response.error('The password does not match.', 401);
    }

    await db.delete(users).where(eq(users.id, id.value));

    return Response.success(true);
  }

  async updateName(id: Identifier, name: Name): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value),
      with: {linkedEmails: true}
    });
    if (!user) return Response.error('User not found.', 404);

    if (user.name === name.value) {
      return Response.error(
        'The new name is already being used in this account.',
        409
      );
    }

    const newUser = await db
      .update(users)
      .set({name: name.value})
      .where(eq(users.id, id.value))
      .returning({updatedName: users.name});
    if (!newUser[0]) return Response.error("User name can't be updated", 500);

    user.name = newUser[0].updatedName;

    const response = createUser(user);

    return Response.success(response);
  }

  async updateEmail(id: Identifier, email: Email): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value),
      with: {linkedEmails: true}
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    if (user.linkedEmails.length === 0) {
      return Response.error(
        'The new email needs to be one of your linked emails.',
        401
      );
    }

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

    const newUser = await db
      .update(users)
      .set({email: email.value})
      .where(eq(users.id, id.value))
      .returning({updatedEmail: users.email});
    if (!newUser[0]) return Response.error("User email can't be updated", 500);

    user.email = newUser[0].updatedEmail;

    const response = createUser(user);

    return Response.success(response);
  }

  async updatePassword(
    id: Identifier,
    password: Password
  ): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value),
      with: {linkedEmails: true}
    });
    if (!user) return Response.error('User not found.', 404);

    const newPassword = await bcryptjs.hash(password.value, 13);

    const newUser = await db
      .update(users)
      .set({password: newPassword})
      .where(eq(users.id, id.value))
      .returning({updatedPassword: users.password});
    if (!newUser[0]) {
      return Response.error("User password can't be updated", 500);
    }

    user.password = newUser[0].updatedPassword;

    const response = createUser(user);

    return Response.success(response);
  }

  async saveLinkedEmail(
    id: Identifier,
    linkedEmail: Email
  ): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value),
      with: {linkedEmails: true}
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

    const newEmail = await db
      .insert(linkedEmails)
      .values({
        user: user.id,
        email: linkedEmail.value
      })
      .returning();
    if (!newEmail[0]) {
      return Response.error("The new email can't be created", 500);
    }

    const authService = new AuthService();
    await authService.sendLinkedEmailVerification(id, linkedEmail);

    user.linkedEmails.push(newEmail[0]);
    const response = createUser(user);
    return Response.success(response, 201);
  }

  async deleteLinkedEmail(
    id: Identifier,
    linkedEmail: Email
  ): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const emails = await db.query.linkedEmails.findMany({
      where: eq(linkedEmails.user, user.id)
    });
    if (emails.length === 0) {
      return Response.error('User linked email not found.', 404);
    }

    const linkedEmailExists = emails.some(
      item => item.email === linkedEmail.value
    );
    if (!linkedEmailExists) {
      return Response.error('User linked email not found.', 404);
    }

    const isPrimaryEmail = user.email === linkedEmail.value;
    if (isPrimaryEmail) {
      return Response.error("You can't delete the primary email.", 401);
    }

    await db
      .delete(linkedEmails)
      .where(eq(linkedEmails.email, linkedEmail.value));

    return Response.success(true);
  }
}
