'use server';

import { Email } from 'domain/models/values';
import { z } from 'zod';
import { ActionState } from '@/types';

const formSchema = z.object({
  email: z.string().email()
});

export type ResetPasswordFormValues = z.infer<typeof formSchema>;

export const resetPassword = async (
  _prevState: any,
  formData: FormData
): Promise<ActionState | void> => {
  const input = formSchema.safeParse({
    email: formData.get('email')
  });

  if (!input.success) {
    const { fieldErrors } = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const email = new Email(input.data.email);
  /* eslint-disable-next-line -- Not implemented yet */
  console.log(email);
  /*const {error} = await authServiceRegister(name, email, password);

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }*/
};
