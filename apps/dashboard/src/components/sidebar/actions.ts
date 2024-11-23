'use server';

import {redirect} from 'next/navigation';
import {signOut} from '@/lib/auth';
import {env} from '@/lib/enviroment';
import {Resend} from 'resend';

export const sendFeedbackEmail = async (
  id: string,
  name: string,
  feedback: string
) => {
  const client = new Resend(env().RESEND_TOKEN);

  const {error} = await client.emails.send({
    from: 'Formizee Feedback <noreply@formizee.com>',
    subject: `New Submission from ${name}`,
    to: 'feedback@formizee.com',
    html: `<strong>${id}</strong> share his feedback:<br/><br/>${feedback}`
  });

  if (error) {
    console.error(error);
  }
};

export const logout = async () => {
  await signOut();
  redirect('/');
};
