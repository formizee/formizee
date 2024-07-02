import type {WaitlistService as Service} from 'domain/services';
import type {Email} from 'domain/models/values';
import {Response} from 'domain/models';
import {db, eq, waitlist} from '@drizzle/db';
import {joinAdminWaitlist, joinUserWaitlist} from '@emails/waitlist';
import {MailService} from './mail';

export class WaitlistService implements Service {
  async join(email: Email): Promise<Response<true>> {
    const userExists = await db.query.waitlist.findFirst({
      where: eq(waitlist.email, email.value)
    });
    if (userExists) {
      return Response.error(
        {
          name: 'Be patient...',
          description:
            "You're already on the list! We'll keep you updated on Formizee launch."
        },
        409
      );
    }

    await db.insert(waitlist).values({email: email.value});

    const mailService = new MailService();

    const supportEmail = process.env.SUPPORT_EMAIL;

    if (supportEmail) {
      const adminEmail = joinAdminWaitlist(supportEmail);
      mailService.send(adminEmail);
    }

    const userEmail = joinUserWaitlist(email.value);
    mailService.send(userEmail);

    return Response.success(true, 201);
  }
}
