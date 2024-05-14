'use server';

import {authServiceLogin} from '@/data/services/auth';
import {Email} from '@/domain/models/values';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {z} from 'zod';

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
    const {fieldErrors} = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const email = new Email(input.data.email);
  const password = input.data.password;

  await authServiceLogin(email, password).catch(error => {
    return {
      code: 'EXISTS_ERROR',
      key: 'password',
      message: error.message
    };
  });

  revalidatePath('/', 'layout');
  redirect('/dashboard');
};
