import {Uid, Name, Email, Password} from 'domain/models/values';
import {UsersRepository} from 'domain/repositories';
import {Response, User} from 'domain/models';

import {DatabaseConfigProvider} from '@/lib/database';
import {users} from '@/data/models/schema';
import {drizzle} from 'drizzle-orm/d1';
import {hash} from 'bcryptjs';
import {eq} from 'drizzle-orm';
import {
  parseLinkedEmails,
  parseLinkedForms,
  stringifyLinkedEmails,
  stringifyLinkedForms
} from '@/lib/models';

export class UsersRepositoryImplementation implements UsersRepository {
  private readonly db: any;

  constructor() {
    const configProvider = DatabaseConfigProvider.getInstance();
    const dbBinding = configProvider.getDb();
    this.db = drizzle(dbBinding);
  }

  async load(identifier: Uid | Email) {
    let response;

    if (identifier.value.includes('@')) {
      response = await this.db
        .select()
        .from(users)
        .where(eq(users.email, identifier.value));
    } else {
      response = await this.db
        .select()
        .from(users)
        .where(eq(users.id, identifier.value));
    }

    if (!response[0]) return Response.error('User not found.', 404);

    const forms = await parseLinkedForms(response[0].forms);
    const linkedEmails = await parseLinkedEmails(response[0].linkedEmails);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      forms,
      linkedEmails
    );
    return Response.success(user);
  }

  async loadPasswordHash(identifier: Uid) {
    const response = await this.db
      .select()
      .from(users)
      .where(eq(users.id, identifier.value));

    if (!response[0]) return Response.error('User not found.', 404);

    return Response.success(response[0].password);
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
    if (!deleted[0]) return Response.error('Internal error.');

    return Response.success('User deleted.');
  }

  async updateName(uid: Uid, newName: Name) {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const updated = await this.db
      .updated(users)
      .set({name: newName.value})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.');

    return Response.success('User name updated.');
  }

  async updateEmail(uid: Uid, newEmail: Email) {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const updated = await this.db
      .updated(users)
      .set({email: newEmail.value})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.');

    return Response.success('User email updated.');
  }

  async updatePassword(uid: Uid, newPassword: Password) {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const newHashedPassword = hash(newPassword.value, 13);

    const updated = await this.db
      .updated(users)
      .set({password: newHashedPassword})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.');

    return Response.success('User email updated.');
  }

  async updateLinkedEmails(uid: Uid, linkedEmails: Email[]) {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.id, uid.value));
    if (!userExists[0]) return Response.error('User not found.', 404);

    const _linkedEmails = await stringifyLinkedEmails(linkedEmails);

    const updated = await this.db
      .updated(users)
      .set({linkedEmails: _linkedEmails})
      .where(eq(users.id, uid.value))
      .returning();
    if (!updated[0]) return Response.error('Internal error.');

    return Response.success('User email updated.');
  }

  async save(name: Name, email: Email, password: Password) {
    const userExists = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value));
    if (userExists[0]) Response.error('User already exists.', 409);

    const hashedPassword = await hash(password.value, 13);
    const linkedEmails = await stringifyLinkedEmails([email]);
    const forms = await stringifyLinkedForms([]);

    const newUser = await this.db
      .insert(users)
      .values({
        name: name.value,
        email: email.value,
        linkedEmails,
        forms,
        password: hashedPassword
      })
      .returning();
    if (!newUser[0]) return Response.error('Internal error.');

    const user = new User(newUser[0].id, newUser[0].name, newUser[0].email);
    return Response.success(user, 201);
  }
}
