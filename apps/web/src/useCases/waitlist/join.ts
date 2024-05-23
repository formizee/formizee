'use server';

import {waitlistServiceJoin} from '@/data/services/waitlist';
import {Email} from 'domain/models/values';
import {revalidatePath} from 'next/cache';
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

  const email = new Email(input.data.email);
  const {error} = await waitlistServiceJoin(email);

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  revalidatePath('/', 'layout');
  redirect('/waitlist');
};
