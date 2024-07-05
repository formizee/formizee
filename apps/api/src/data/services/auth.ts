import {randomInt} from 'crypto';
import type {Identifier, Email, Name, Password} from 'domain/models/values';
import type {AuthService as Service} from 'domain/services';
import {Response, type User} from 'domain/models';
import bcryptjs from 'bcryptjs';
import {
  db,
  eq,
  and,
  users,
  authTokens,
  linkedEmails,
  teams,
  members
} from '@drizzle/db';
import {verifyEmail, verifyLinkedEmail} from '@emails/auth';
import {createUser} from 'src/lib/models';
import {decrypt, encrypt} from '@/lib/auth/jwt';
import type {LinkedEmailToken} from '@/lib/auth/types';
import {MailService} from './mail';

export class AuthService implements Service {
  async login(email: Email, password: string): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.value),
      with: {linkedEmails: true}
    });
    if (!user) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid email or password.'
        },
        401
      );
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid email or password.'
        },
        401
      );
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
        {
          name: 'Not available',
          description: 'The email is already assigned to an account.'
        },
        409
      );
    }

    const passwordHash = await bcryptjs.hash(password.value, 13);

    const user = await db
      .insert(users)
      .values({
        name: name.value,
        email: email.value,
        password: passwordHash
      })
      .returning();

    if (!user[0]) {
      return Response.error(
        {
          name: 'Internal error',
          description: "User can't be created"
        },
        500
      );
    }

    await db.insert(linkedEmails).values({
      user: user[0].id,
      email: email.value,
      isVerified: true
    });

    const emails = await db.query.linkedEmails.findMany({
      where: eq(linkedEmails.user, user[0].id)
    });

    const response = createUser({linkedEmails: emails, ...user[0]});
    return Response.success(response);
  }

  async verify(email: Email, token: string): Promise<Response<User>> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.value),
      with: {linkedEmails: true}
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const currentToken = await db.query.authTokens.findFirst({
      where: and(
        eq(authTokens.user, user.id),
        eq(authTokens.email, email.value)
      )
    });

    if (!currentToken) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid token.'
        },
        401
      );
    }

    if (new Date() > currentToken.expiresAt) {
      await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Expired token, please get a new one.'
        },
        401
      );
    }

    if (currentToken.token.toString() !== token) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid token.'
        },
        401
      );
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
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const token = await db.query.authTokens.findFirst({
      where: and(eq(authTokens.user, user.id), eq(authTokens.email, user.email))
    });

    const mailService = new MailService();

    if (token) {
      if (new Date() < token.expiresAt) {
        mailService.send(verifyEmail(token.email, token.token.toString()));
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
      return Response.error(
        {
          name: 'Internal error',
          description: "Token can't be created"
        },
        500
      );
    }

    mailService.send(verifyEmail(email.value, newTokenCode.toString()));
    return Response.success(true, 202);
  }

  async sendLinkedEmailVerification(
    id: Identifier,
    email: Email
  ): Promise<Response<true>> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id.value)
    });
    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const emailExists = await db.query.linkedEmails.findFirst({
      where: and(
        eq(linkedEmails.user, user.id),
        eq(linkedEmails.email, email.value)
      )
    });
    if (!emailExists) {
      return Response.error(
        {
          name: 'Not found',
          description: 'The email does not exists in the user linked emails.'
        },
        404
      );
    }

    if (emailExists.isVerified) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'The email is already verified.'
        },
        401
      );
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
          data: {id: id.value, email: email.value, token: token.token}
        });
        const magicLink = `https://formizee.com/auth/linked-emails/verify?token=${jwtToken}`;
        mailService.send(verifyLinkedEmail(token.email, magicLink));
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
      return Response.error(
        {
          name: 'Internal error',
          description: "Token can't be created"
        },
        500
      );
    }

    const jwtToken = await encrypt({
      expiresAt,
      data: {id: id.value, email: email.value, token: newTokenCode}
    });
    const magicLink = `https://formizee.com/auth/linked-emails/verify?token=${jwtToken}`;

    mailService.send(verifyLinkedEmail(email.value, magicLink));
    return Response.success(true, 202);
  }

  async verifyLinkedEmail(jwtToken: string): Promise<Response<true>> {
    const token = await decrypt(jwtToken);
    const data = token?.data as LinkedEmailToken;

    if (!data.token || !data.id || !data.email) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid token.'
        },
        401
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, data.id)
    });

    if (!user) {
      return Response.error(
        {
          name: 'Not found',
          description: 'User not found.'
        },
        404
      );
    }

    const currentToken = await db.query.authTokens.findFirst({
      where: and(eq(authTokens.user, data.id), eq(authTokens.email, data.email))
    });

    if (!currentToken) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid token.'
        },
        401
      );
    }

    if (new Date() > currentToken.expiresAt) {
      await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Expired token, please get a new one.'
        },
        401
      );
    }

    if (currentToken.token !== data.token) {
      return Response.error(
        {
          name: 'Unauthorized',
          description: 'Invalid token.'
        },
        401
      );
    }

    await db.delete(authTokens).where(eq(authTokens.id, currentToken.id));

    await db
      .update(linkedEmails)
      .set({isVerified: true})
      .where(
        and(eq(linkedEmails.user, user.id), eq(linkedEmails.email, data.email))
      )
      .returning();

    const linkedTeamsData = await db.query.members.findMany({
      where: eq(members.user, user.id),
      with: {team: true}
    });
    if (!linkedTeamsData[0]) {
      return Response.success(true);
    }
    const linkedTeams = linkedTeamsData.map(item => {
      return item.team;
    });

    for (const team of linkedTeams) {
      const newAvailableEmails = team.availableEmails;
      newAvailableEmails.push(data.email);

      await db
        .update(teams)
        .set({availableEmails: newAvailableEmails})
        .where(eq(teams.id, team.id));
    }

    return Response.success(true);
  }
}
