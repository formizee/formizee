import {randomInt} from 'crypto';
import type {Email, Name, Password} from 'domain/models/values';
import type {AuthService as Service} from 'domain/services';
import {Mail, Response, type User} from 'domain/models';
import {compare} from 'bcryptjs';
import {verifyEmailTemplate} from '@emails/auth';
import {db, eq, users, authTokens} from '@db/index';
import {SendMail} from '@/useCases/mail';
import {createUser} from '@/lib/utils';

export class AuthService implements Service {
  async login(email: Email, password: string): Promise<Response<User>> {
    const user = await db.query.users.findFirst({with: {email: email.value}});
    if (!user) {
      return Response.error('User or password not match.', 401);
    }

    const passwordMatch = await compare(password, user.password);
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
      with: {email: email.value}
    });
    if (userExists) {
      return Response.error(
        'The email is already assigned to an account.',
        409
      );
    }

    const user = await db
      .insert(users)
      .values({
        name: name.value,
        email: email.value,
        password: password.value
      })
      .returning();

    const response = createUser(user[0]);
    return Response.success(response);
  }

  async verify(email: Email, token: string): Promise<Response<User>> {
    const currentToken = await db.query.authTokens.findFirst({
      with: {email: email.value}
    });
    if (!currentToken) {
      return Response.error('Invalid token.', 401);
    }

    if (new Date() > currentToken.expiresAt) {
      await db.delete(authTokens).where(eq(authTokens.email, email.value));
      return Response.error('Expired token, please get a new one.', 401);
    }

    if (currentToken.token.toString() !== token) {
      return Response.error('Invalid token.', 401);
    }

    await db.delete(authTokens).where(eq(authTokens.email, email.value));

    const user = await db
      .update(users)
      .set({isVerified: true})
      .where(eq(users.email, email.value))
      .returning();
    if (!user[0]) return Response.error('User not found.', 404);

    const response = createUser(user[0]);
    return Response.success(response);
  }

  async sendVerification(email: Email): Promise<Response<true>> {
    const sendEmail = async (to: string, token: string): Promise<void> => {
      const html = verifyEmailTemplate(token);

      const mail = new Mail(
        'Formizee.',
        'noreply@formizee.com',
        to,
        'Email Verification',
        html
      );

      const service = new SendMail(mail);
      await service.run();
    };

    const user = await db.query.users.findFirst({with: {email: email.value}});
    if (!user) {
      return Response.error('The user does not exists.', 404);
    }

    const token = await db.query.authTokens.findFirst({
      with: {email: email.value}
    });
    if (token) {
      if (new Date() < token.expiresAt) {
        await sendEmail(token.email, token.token.toString());
        return Response.success(true, 202);
      }
      await db.delete(authTokens).where(eq(authTokens.email, email.value));
    }

    const newTokenCode = Math.floor(randomInt(100000, 999999 + 1));

    const newToken = await db
      .insert(authTokens)
      .values({
        email: email.value,
        token: newTokenCode
      })
      .returning();

    if (!newToken[0]) {
      return Response.error("Token can't be created.", 500);
    }

    await sendEmail(email.value, newTokenCode.toString());
    return Response.success(true, 202);
  }
}
