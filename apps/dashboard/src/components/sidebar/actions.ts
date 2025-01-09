'use server';

import {redirect} from 'next/navigation';
import {signOut} from '@/lib/auth';

const FEEDBACK_ENDPOINT = 'enp_2WgsdoNbzHHYkXnzbkCcpqx3aUjx';

export const sendFeedbackEmail = async (
  id: string,
  name: string,
  feedback: string
) => {
  const res = await fetch(
    `https://api.formizee.com/v1/f/${FEEDBACK_ENDPOINT}`,
    {
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({id, name, feedback}),
      method: 'post'
    }
  );

  if (!res.ok) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const data = (await res.json()) as any;
    return Promise.resolve({error: new Error(data.message)});
  }

  return Promise.resolve({error: null});
};

export const logout = async () => {
  await signOut();
  redirect('/');
};
