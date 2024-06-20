import {randomInt} from 'crypto';
import type {Identifier, Email, Name, Password} from 'domain/models/values';
import type {AuthService as Service} from 'domain/services';
import {Response, type User} from 'domain/models';
import bcryptjs from 'bcryptjs';
import {db, eq, and, users, authTokens} from '@drizzle/db';
import {verifyEmail, verifyLinkedEmail} from '@emails/auth';
import {createUser} from '@/lib/utils';
import {decrypt, encrypt} from '@/lib/auth/jwt';
import type {LinkedEmailToken} from '@/lib/auth/types';
import {MailService} from './mail';

export class AuthService implements Service {
  async login(email: Email, password: string): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.value)
    });
    if (!user) {
      return Response.error('User or password not match.', 401);
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return Response.error('User or password not match.', 401);
    }

    await db
      .update(users)
      .set({lastAccess: new Date()})
      .where(eq(users.id, user.id));

    const response = createUser(user);
    return Response.success(response);
  }

  async register(
    name: Name,
    email: Email,
    password: Password
  ): Promise<Response<User>> {
    const userExists = await db.query.users.findFirst({
      where: eq(users.email, email.value)
    });
    if (userExists) {
      return Response.error(
        'The email is already assigned to an account.',
        409
      );
    }

    const passwordHash = await bcryptjs.hash(password.value, 13);

    const user = await db
      .insert(users)
      .values({
        name: name.value,
        email: email.value,
        password: passwordHash,
        linkedEmails: [{email: email.value, isVerified: true}]
      })
      .returning();

    if (!user[0]) {
      return Response.error("User can't be created", 500);
    }

    const response = createUser(user[0]);
    return Response.success(response);
  }

  async verify(email: Email, token: string): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.value)
    });
    if (!user) {
      return Response.error('User not found.', 404);
    }

    const currentToken = await db.query.authTokens.findFirst({
      where: and(
        eq(authTokens.user, user.id),
        eq(authTokens.email, email.value)
      )
    });

    if (!currentToken) {
      return Response.error('Invalid token.', 401);
    }

    if (new Date() > currentToken.expiresAt) {
      await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));
      return Response.error('Expired token, please get a new one.', 401);
    }

    if (currentToken.token.toString() !== token) {
      return Response.error('Invalid token.', 401);
    }

    await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));

    await db.update(users).set({isVerified: true}).where(eq(users.id, user.id));

    user.isVerified = true;
    const response = createUser(user);
    return Response.success(response);
  }

  async sendVerification(email: Email): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.value)
    });
    if (!user) {
      return Response.error('The user does not exists.', 404);
    }

    const token = await db.query.authTokens.findFirst({
      where: and(eq(authTokens.user, user.id), eq(authTokens.email, user.email))
    });

    const mailService = new MailService();

    if (token) {
      if (new Date() < token.expiresAt) {
        await mailService.send(
          verifyEmail(token.email, token.token.toString())
        );
        return Response.success(true, 202);
      }
      await db.delete(authTokens).where(eq(authTokens.id, token.id));
    }

    const newTokenCode = Math.floor(randomInt(100000, 999999 + 1));

    const newToken = await db
      .insert(authTokens)
      .values({
        user: user.id,
        email: email.value,
        token: newTokenCode
      })
      .returning();

    if (!newToken[0]) {
      return Response.error("Token can't be created.", 500);
    }

    await mailService.send(verifyEmail(email.value, newTokenCode.toString()));
    return Response.success(true, 202);
  }

  async sendLinkedEmailVerification(
    uid: Identifier,
    email: Email
  ): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, uid.value)
    });
    if (!user) {
      return Response.error('The user does not exists.', 404);
    }

    const emailExists = user.linkedEmails.some(
      linkedEmail => linkedEmail.email === email.value
    );
    if (!emailExists) {
      return Response.error(
        'The email does not exists in the user linked emails.',
        404
      );
    }

    const isAlreadyVerified = user.linkedEmails.some(
      linkedEmail => linkedEmail.email === email.value && linkedEmail.isVerified
    );
    if (isAlreadyVerified) {
      return Response.error('The email is already verified.', 401);
    }

    const token = await db.query.authTokens.findFirst({
      where: and(
        eq(authTokens.user, user.id),
        eq(authTokens.email, email.value)
      )
    });

    const mailService = new MailService();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    if (token) {
      if (new Date() < token.expiresAt) {
        const jwtToken = await encrypt({
          expiresAt,
          data: {id: uid.value, email: email.value, token: token.token}
        });
        const magicLink = `https://formizee.com/auth/linked-emails/verify?token=${jwtToken}`;
        await mailService.send(verifyLinkedEmail(token.email, magicLink));
        return Response.success(true, 202);
      }
      await db.delete(authTokens).where(eq(authTokens.id, token.id));
    }

    const newTokenCode = Math.floor(randomInt(100000, 999999 + 1));

    const newToken = await db
      .insert(authTokens)
      .values({
        user: user.id,
        email: email.value,
        token: newTokenCode
      })
      .returning();

    if (!newToken[0]) {
      return Response.error("Token can't be created.", 500);
    }

    const jwtToken = await encrypt({
      expiresAt,
      data: {id: uid.value, email: email.value, token: newTokenCode}
    });
    const magicLink = `https://formizee.com/auth/linked-emails/verify?token=${jwtToken}`;

    await mailService.send(verifyLinkedEmail(email.value, magicLink));
    return Response.success(true, 202);
  }

  async verifyLinkedEmail(jwtToken: string): Promise<Response<true>> {
    const token = await decrypt(jwtToken);
    const data = token?.data as LinkedEmailToken;

    if (!data.token || !data.id || !data.email) {
      return Response.error('Invalid token.', 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, data.id)
    });

    if (!user) {
      return Response.error('User not found.', 404);
    }

    const currentToken = await db.query.authTokens.findFirst({
      where: and(
        eq(authTokens.user, data.id),
        eq(authTokens.email, data.email)
      )
    });

    if (!currentToken) {
      return Response.error('Invalid token.', 401);
    }

    if (new Date() > currentToken.expiresAt) {
      await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));
      return Response.error('Expired token, please get a new one.', 401);
    }

    if (currentToken.token !== data.token) {
      return Response.error('Invalid token.', 401);
    }

    await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));

    const linkedEmails = user.linkedEmails.map(linkedEmail => {
      if (linkedEmail.email === data.email) {
        return {email: linkedEmail.email, isVerified: true};
      }
      return linkedEmail;
    });

    await db
      .update(users)
      .set({linkedEmails})
      .where(eq(users.id, user.id))
      .returning();

    return Response.success(true);
  }
}
