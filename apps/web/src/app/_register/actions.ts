import type {ActionState} from '@/types';
import {Email, Name, Password} from 'domain/models/values';
import {redirect} from 'next/navigation';
import {z} from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(4, {message: 'Name must be between 4 and 20 characters long'})
    .max(20, {message: 'Name must be between 4 and 20 characters long'})
    .regex(/^[a-z0-9.-]+$/, {
      message: 'Name must only contain lowercase letters and numbers'
    }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, {message: 'Password must be between 8 and 32 characters long'})
    .max(32, {message: 'Password must be between 8 and 32 characters long'})
});

export type RegisterFormValues = z.infer<typeof formSchema>;

export const register = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
  const input = formSchema.safeParse({
    name: formData.get('name'),
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

  const name = new Name(input.data.name);
  const email = new Email(input.data.email);
  const password = new Password(input.data.password);

  const response = await fetch('/api/auth/register', {
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    }),
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

  redirect('/auth/verify');
};
