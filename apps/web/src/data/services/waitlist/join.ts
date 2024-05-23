'use server';

import type { WaitlistServiceJoin } from 'domain/services/waitlist';
import type { Email } from 'domain/models/values';

export const waitlistServiceJoin: WaitlistServiceJoin = async (
  email: Email
) => {
  const request = new Request(
    `${process.env.NEXT_PUBLIC_API_URL}/waitlist/join`,
    {
      body: JSON.stringify({ email: email.value }),
      headers: { Accept: 'application/json' },
      method: 'POST',
  });

  const response = await fetch(request);
  const data = await response.json();

  if (!response.ok) return { error: { name: response.statusText, message: data } }

  return { error: null };
};

export default waitlistServiceJoin;
