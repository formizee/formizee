import type {ActionState} from '@/types';
import {redirect} from 'next/navigation';
import {z} from 'zod';

const sendVerificationSchema = z.object({
  email: z.string().email()
});

export type ResetPasswordFormValues = z.infer<typeof sendVerificationSchema>;

export const resetPassword = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
  const input = sendVerificationSchema.safeParse({
    email: formData.get('email')
  });

  if (!input.success) {
    const {fieldErrors} = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const response = await fetch('/api/auth/send-verification', {
    body: JSON.stringify({email: input.data.email, type: 'password'}),
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

  redirect('/auth/verify');
};
