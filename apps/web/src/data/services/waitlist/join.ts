'use server';

import type {WaitlistServiceJoin} from 'domain/services/waitlist';
import type {Email} from 'domain/models/values';

export const waitlistServiceJoin: WaitlistServiceJoin = async (
  email: Email
) => {
  try {
    await fetch(process.env.NEXT_PUBLIC_WAITLIST_URL ?? 'null', {
      method: 'POST',
      body: JSON.stringify({email: email.value}),
      headers: {Accept: 'application/json'}
    });
    return Promise.resolve({error: null});
  } catch (error) {
    return Promise.reject({error});
  }
};

export default waitlistServiceJoin;
