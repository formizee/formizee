import {Uid, Name, Email, Password} from 'domain/models/values';
import {UsersRepository} from 'domain/repositories';
import {SecretsProvider} from '@/lib/secrets';
import {Response, User} from 'domain/models';

import {DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {users} from '@/data/models';
import {eq} from 'drizzle-orm';
import {hash} from 'bcryptjs';

export class UsersRepositoryImplementation implements UsersRepository {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = SecretsProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async load(uid: Uid) {
    const response = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!response[0]) return Response.error('User not found.', 404);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      response[0].forms,
      response[0].linkedEmails
    );

    return Response.success(user);
  }

  async save(name: Name, email: Email, password: Password) {
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
      response[0].forms,
      response[0].linkedEmails
    );

    return Response.success(user, 201);
  }

  async delete(uid: Uid) {
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

    return Response.success('User deleted.');
  }

  async updateName(uid: Uid, newName: Name) {
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

    return Response.success('User name updated.');
  }

  async updateEmail(uid: Uid, newEmail: Email) {
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

    return Response.success('User email updated.');
  }

  async updatePassword(uid: Uid, newPassword: Password) {
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

    return Response.success('User email updated.');
  }

  async updateLinkedEmails(uid: Uid, linkedEmails: Email[]) {
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

    return Response.success('User email updated.');
  }
}
