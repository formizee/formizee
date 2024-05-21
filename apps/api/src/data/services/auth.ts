import { Name, Email, Password } from 'domain/models/values';
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import { DatabaseConfigProvider } from '@/lib/database';
import { Response, User } from 'domain/models';
import { AuthService } from "domain/services";
import { users } from '../models/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { parseLinkedEmails, parseLinkedForms } from '@/lib/models';

export class AuthServiceImplementation implements AuthService {
  private readonly db: DrizzleD1Database;

  constructor () {
    const configProvider = DatabaseConfigProvider.getInstance();
    const dbBinding = configProvider.getDb();
    this.db = drizzle(dbBinding);
  }

  async login(email: Email, password: string): Promise<Response<User>> {
    const response = await this.db.select().from(users).where(eq(users.email, email.value));
    if (!response[0]) return Response.error("Invalid email or password.", 401);

    const authenticate = await compare(response[0].password, password);
    if (!authenticate) return Response.error("Invalid email or password.", 401);

    const linkedForms = await parseLinkedForms(response[0].forms);
    const linkedEmails = await parseLinkedEmails(response[0].linkedEmails);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      linkedForms,
      linkedEmails
    )

    return Response.success(user);
  }

  async register(name: Name, email: Email, password: Password): Promise<Response<User>> {
    const userExists = await this.db.select().from(users).where(eq(users.email, email.value));
    if (userExists[0]) return Response.error("User already exists.", 409);

    const response = await this.db.insert(users).values({
      forms: '[]',
      name: name.value,
      email: email.value,
      password: password.value,
      linkedEmails: `[${email.value}]`
    }).returning();

    if(!response[0]) return Response.error("Unexpected error.", 500);

    const linkedForms = await parseLinkedForms(response[0].forms);
    const linkedEmails = await parseLinkedEmails(response[0].linkedEmails);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      linkedForms,
      linkedEmails
    )

    return Response.success(user);
  }
}
