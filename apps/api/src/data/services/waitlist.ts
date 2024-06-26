import {type DrizzleD1Database} from 'drizzle-orm/d1';
import {type WaitlistService} from 'domain/services';
import {type Email} from 'domain/models/values';
import {Response} from 'domain/models';
import {drizzle} from 'drizzle-orm/d1';
import {eq} from 'drizzle-orm';
import {SecretsProvider} from '@/lib/secrets';
import {waitlist} from '../models';

export class WaitlistServiceImplementation implements WaitlistService {
  private readonly db: DrizzleD1Database;

  constructor() {
    const db = SecretsProvider.getInstance().getDb();
    this.db = drizzle(db);
  }

  async join(email: Email): Promise<Response<true>> {
    const alreadyExists = await this.db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email.value));

    if (alreadyExists[0]) {
      return Response.error(
        "You're already on the list! We'll keep you updated on Formizee launch.",
        409
      );
    }

    await this.db.insert(waitlist).values({email: email.value});

    return Response.success(true, 201);
  }
}
