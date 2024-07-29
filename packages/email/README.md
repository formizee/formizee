# Emails

We are using `react-email` and `nodemailer` to create our emails.
For more info see [React Email Docs](https://react.email/docs/getting-started/manual-setup)

## Usage

```typescript
import {waitlistEmail} from '@formizee/emails/templates';
import {sendEmail} from '@formizee/emails';

await sendEmail({
  template: waitlistEmail,
  subject: "You're on waitlist!",
  from: "noreply@formizee.com",
  to: "example@formizee.com"
});
```
