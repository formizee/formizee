import type {ActionState} from '@/types';
import {redirect} from 'next/navigation';
import {z} from 'zod';

const verifyTokenSchema = z.object({
  token: z
    .string()
    .length(6, {message: 'The code must have 6 numbers.'})
    .regex(/^\d+$/, {message: 'The code must be only numbers.'})
});

export type VerifyTokenFormValues = z.infer<typeof verifyTokenSchema>;

export const verifyToken = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
  const input = verifyTokenSchema.safeParse({
    token: formData.get('token')
  });

  if (!input.success) {
    const {fieldErrors} = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const {token} = input.data;

  const response = await fetch('/api/auth/verify', {
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token}),
    credentials: 'include',
    method: 'POST'
  });

  const {error, data} = await response.json();

  if (error || !data) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  if (data.type === 'password') {
    redirect('/auth/update-password');
  } else {
    redirect('/dashboard');
  }
};
