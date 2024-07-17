import type {ActionState} from '@/types';
import {Email} from 'domain/models/values';
import {redirect} from 'next/navigation';
import {z} from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginFormValues = z.infer<typeof formSchema>;

export const login = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
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

  const response = await fetch('/api/auth/login', {
    body: JSON.stringify({email: email.value, password}),
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
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

  if (response.status === 403) redirect('/auth/verify');
  else redirect('/dashboard');
};
