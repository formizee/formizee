'use server';

import type { WaitlistServiceJoin } from 'domain/services/waitlist';
import type { Email } from 'domain/models/values';

export const waitlistServiceJoin: WaitlistServiceJoin = async (
  email: Email
) => {
  const request = new Request(
    `${process.env.NEXT_PUBLIC_API_URL}/waitlist/join`,
    {
      headers: { "Content-Type": 'application/json' },
      body: JSON.stringify({ email: email.value }),
      method: 'POST',
  });

  const response = await fetch(request);
  const data = await response.json();

  if (!response.ok) return { error: { name: "Be Patient...", message: data.error } }

  return { error: null };
};

export default waitlistServiceJoin;
