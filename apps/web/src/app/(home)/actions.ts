'use server';

import type {ActionState} from '@/types';
import {redirect} from 'next/navigation';
import {z} from 'zod';

const formSchema = z.object({
  email: z.string().email()
});

export type JoinWaitlistFormValues = z.infer<typeof formSchema>;

export const joinWaitlist = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
  const input = formSchema.safeParse({
    email: formData.get('email')
  });

  if (!input.success) {
    const {fieldErrors} = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  if (!process.env.WEB_URL)
    throw new Error('Webpage URL enviroment variable is not defined.');

  const response = await fetch(`${process.env.WEB_URL}/api/waitlist/join`, {
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: input.data.email}),
    method: 'POST'
  });

  const {error} = await response.json();

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  redirect('/waitlist');
};
