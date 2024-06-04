import {
  type Uid,
  type Name,
  type Email,
  type Password
} from 'domain/models/values';
import {type UsersRepository} from 'domain/repositories';
import {Response, User} from 'domain/models';
import {type DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {eq} from 'drizzle-orm';
import {hash} from 'bcryptjs';
import {users} from '@/data/models';
import {SecretsProvider} from '@/lib/secrets';

export class UsersRepositoryImplementation implements UsersRepository {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = SecretsProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async load(uid: Uid): Promise<Response<User>> {
    const response = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!response[0]) return Response.error('User not found.', 404);

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

  async save(
    name: Name,
    email: Email,
    password: Password
  ): Promise<Response<User>> {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value));
    if (userExists[0]) return Response.error('User already exists.', 409);

    const response = await this.db
      .insert(users)
      .values({
        forms: [],
        name: name.value,
        email: email.value,
        password: password.value,
        linkedEmails: [email.value]
      })
      .returning();

    if (!response[0]) return Response.error('Unexpected error.', 500);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      response[0].isVerified,
      response[0].permission,
      response[0].forms,
      response[0].linkedEmails
    );

    return Response.success(user, 201);
  }

  async delete(uid: Uid): Promise<Response<true>> {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const deleted = await this.db
      .delete(users)
      .where(eq(users.id, uid.value))
      .returning();
    if (!deleted[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }

  async updateName(uid: Uid, newName: Name): Promise<Response<true>> {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const updated = await this.db
      .update(users)
      .set({name: newName.value})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }

  async updateEmail(uid: Uid, newEmail: Email): Promise<Response<true>> {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const updated = await this.db
      .update(users)
      .set({email: newEmail.value})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }

  async updatePassword(
    uid: Uid,
    newPassword: Password
  ): Promise<Response<true>> {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const newHashedPassword = await hash(newPassword.value, 13);

    const updated = await this.db
      .update(users)
      .set({password: newHashedPassword})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }

  async updateLinkedEmails(
    uid: Uid,
    linkedEmails: Email[]
  ): Promise<Response<true>> {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const _linkedEmails: string[] = [];
    linkedEmails.forEach(email => {
      _linkedEmails.push(email.value);
    });

    const updated = await this.db
      .update(users)
      .set({linkedEmails: _linkedEmails})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }
}
