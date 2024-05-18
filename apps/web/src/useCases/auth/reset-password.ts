'use server';

import {Email} from 'domain/models/values';
import {z} from 'zod';
import type {ActionState} from '@/types';
import { authServiceResetPassword } from '@/data/services/auth';

const formSchema = z.object({
  email: z.string().email()
});

export type ResetPasswordFormValues = z.infer<typeof formSchema>;

export const resetPassword = async (
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

  const {error} = await authServiceResetPassword(email);

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  return {
    code: 'SUCCESS',
    title: "Check Your Inbox",
    message: "We have sent you an email."
  };
};
