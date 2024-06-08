import type {WaitlistService as Service} from 'domain/services';
import type {Email} from 'domain/models/values';
import {Response} from 'domain/models';
import {db, waitlist} from '@db/index';

export class WaitlistService implements Service {
  async join(email: Email): Promise<Response<true>> {
    const userExists = await db.query.waitlist.findFirst({
      with: {email: email.value}
    });
    if (userExists) {
      return Response.error(
        "You're already on the list! We'll keep you updated on Formizee launch.",
        409
      );
    }

    await db.insert(waitlist).values({email: email.value});

    return Response.success(true, 201);
  }
}
