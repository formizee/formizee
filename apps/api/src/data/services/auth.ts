import {Name, Email, Password} from 'domain/models/values';
import {DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {Mail, Response, User} from 'domain/models';
import {AuthService} from 'domain/services';
import {SecretsProvider} from '@/lib/secrets';
import {SaveUser} from '@/useCases/users';
import {MailSend} from '@/useCases/mail';

import {verifyEmailTemplate} from '@/emails/auth';
import {authTokens, users} from '@/data/models';
import {compare, hash} from 'bcryptjs';
import {randomInt} from 'node:crypto';
import {eq} from 'drizzle-orm';

export class AuthServiceImplementation implements AuthService {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = SecretsProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async login(email: Email, password: string): Promise<Response<User>> {
    const response = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value));
    if (!response[0]) return Response.error('Invalid email or password.', 401);

    const authenticate = await compare(password, response[0].password);
    if (!authenticate) return Response.error('Invalid email or password.', 401);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      response[0].isVerified,
      response[0].permission,
      response[0].forms,
      response[0].linkedEmails
    );

    return Response.success(user);
  }

  async register(
    name: Name,
    email: Email,
    password: Password
  ): Promise<Response<User>> {
    const hashedPassword = await hash(password.value, 13);

    const service = new SaveUser(name.value, email.value, hashedPassword);
    return await service.run();
  }

  async verifyUser(email: Email, token: string): Promise<Response<User>> {
    // 1. Find the token
    const tokenResponse = await this.db
      .select()
      .from(authTokens)
      .where(eq(authTokens.email, email.value));
    if (!tokenResponse[0]) return Response.error('Invalid token.', 401);

    // 2. Check if is expired.
    const currentTime = new Date();
    const expireTime = new Date(tokenResponse[0].expiresAt);
    if (currentTime > expireTime) {
      await this.db.delete(authTokens).where(eq(authTokens.email, email.value));
      return Response.error('Expired token, please get a new one.', 401);
    }

    // 3. Compare tokens.
    if (tokenResponse[0].token.toString() !== token)
      return Response.error('Invalid token.', 401);

    // 4. Verify user
    const response = await this.db
      .update(users)
      .set({isVerified: true})
      .where(eq(users.email, email.value))
      .returning();
    if (!response[0]) return Response.error('The user does not exists.', 404);

    // 5. Delete the token
    await this.db.delete(authTokens).where(eq(authTokens.email, email.value));

    // 6. Retrieve user
    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      response[0].isVerified,
      response[0].permission,
      response[0].forms,
      response[0].linkedEmails
    );

    return Response.success(user);
  }

  async resetPassword(email: Email, token: string): Promise<Response<User>> {
    // 1. Find the token
    const tokenResponse = await this.db
      .select()
      .from(authTokens)
      .where(eq(authTokens.email, email.value));
    if (!tokenResponse[0]) return Response.error('Invalid token.', 401);

    // 2. Check if is expired.
    const currentTime = new Date();
    const expireTime = new Date(tokenResponse[0].expiresAt);
    if (currentTime > expireTime) {
      await this.db.delete(authTokens).where(eq(authTokens.email, email.value));
      return Response.error('Expired token, please get a new one.', 401);
    }

    // 3. Compare tokens.
    if (tokenResponse[0].token.toString() !== token)
      return Response.error('Invalid token.', 401);

    // 4. Delete the token
    await this.db.delete(authTokens).where(eq(authTokens.email, email.value));

    // 5. Retrieve user
    const response = await this.db
      .update(users)
      .set({verified: true})
      .where(eq(users.email, email.value))
      .returning();
    if (!response[0]) return Response.error('The user does not exists.', 404);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      response[0].isVerified,
      response[0].permission,
      response[0].forms,
      response[0].linkedEmails
    );

    return Response.success(user);
  }

  async sendVerification(email: Email): Promise<Response<true>> {
    const sendEmail = async (to: string, token: string) => {
      const html = verifyEmailTemplate(token);

      const mail = new Mail(
        'Formizee.',
        'noreply@formizee.com',
        to,
        'Email Verification',
        html
      );

      const service = new MailSend(mail);
      await service.run();
    };

    // 0. Check if the user exists.
    const userResponse = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value));
    if (!userResponse[0])
      return Response.error('The user does not exists.', 404);

    // 1. Check if already exists a token and resend the email, otherwise delete the old token.
    const existentToken = await this.db
      .select()
      .from(authTokens)
      .where(eq(authTokens.email, email.value));

    if (existentToken[0]) {
      const expiresAt = new Date(existentToken[0].expiresAt);
      const currentTime = new Date();

      if (currentTime < expiresAt) {
        sendEmail(existentToken[0].email, existentToken[0].token.toString());
        return Response.success(true, 200);
      } else
        await this.db
          .delete(authTokens)
          .where(eq(authTokens.email, email.value));
    }

    // 2. Generate a token
    const token = Math.floor(randomInt(100000, 999999 + 1));

    // 3. Generate expires date
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // 3. Store in auth_tokens db
    const dbResponse = await this.db
      .insert(authTokens)
      .values({
        expiresAt: expiresAt.toISOString(),
        email: email.value,
        token
      })
      .returning();

    if (!dbResponse[0]) Response.error('Internal error.', 500);

    // 4. Send email
    await sendEmail(email.value, token.toString());
    return Response.success(true, 202);
  }
}
