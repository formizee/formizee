'use server';

import { Email } from 'domain/models/values';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authServiceLogin } from '@/data/services/auth';
import { ActionState } from '@/types';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginFormValues = z.infer<typeof formSchema>;

export const login = async (
  _prevState: any,
  formData: FormData
): Promise<ActionState | void> => {
  const input = formSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!input.success) {
    const { fieldErrors } = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const email = new Email(input.data.email);
  const password = input.data.password;

  const { error } = await authServiceLogin(email, password);

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
};
