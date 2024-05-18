'use server';

import {Password} from 'domain/models/values';
import {z} from 'zod';
import type {ActionState} from '@/types';
import {authServiceUpdatePassword } from '@/data/services/auth';

const formSchema = z.object({
  password: z
    .string()
    .min(8, {message: 'Password must be between 8 and 32 characters long'})
    .max(32, {message: 'Password must be between 8 and 32 characters long'})
});

export type UpdatePasswordFormValues = z.infer<typeof formSchema>;

export const updatePassword = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
  const input = formSchema.safeParse({
    password: formData.get('password')
  });

  if (!input.success) {
    const {fieldErrors} = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const password = new Password(input.data.password);

  const {error} = await authServiceUpdatePassword(password);

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }
};
