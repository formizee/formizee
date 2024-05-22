import {Name, Email, Password} from 'domain/models/values';
import {DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {Response, User} from 'domain/models';
import {AuthService} from 'domain/services';
import {DatabaseProvider} from '@/lib/db';
import {SaveUser} from '@/useCases/users';

import {parseLinkedEmails, parseLinkedForms} from '@/lib/adapters';
import {compare, hash} from 'bcryptjs';
import {users} from '../models/schema';
import {eq} from 'drizzle-orm';

export class AuthServiceImplementation implements AuthService {
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = DatabaseProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async login(email: Email, password: string): Promise<Response<User>> {
    const response = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.value));
    if (!response[0]) return Response.error('Invalid email or password.', 401);

    const authenticate = await compare(response[0].password, password);
    if (!authenticate) return Response.error('Invalid email or password.', 401);

    const linkedForms = await parseLinkedForms(response[0].forms);
    const linkedEmails = await parseLinkedEmails(response[0].linkedEmails);

    const user = new User(
      response[0].id,
      response[0].name,
      response[0].email,
      linkedForms,
      linkedEmails
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
}
