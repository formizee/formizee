import {ActionState} from '@/types';
import {z} from 'zod';

const updatePasswordSchema = z.object({
  password: z.string()
});

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export const updatePassword = async (
  _prevState: unknown,
  formData: FormData
): Promise<ActionState | undefined> => {
  const input = updatePasswordSchema.safeParse({
    password: formData.get('password')
  });

  if (!input.success) {
    const {fieldErrors} = input.error.flatten();

    return {
      code: 'VALIDATION_ERROR',
      fieldErrors
    };
  }

  const response = await fetch('/api/profile/password', {
    body: JSON.stringify({password: input.data.password}),
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    method: 'PUT'
  });

  const {error} = await response.json();

  if (error) {
    return {
      code: 'COMMON_ERROR',
      title: error.name,
      message: error.message
    };
  }

  return {
    code: 'SUCCESS',
    title: "That's It!",
    message:
      'Your password was updated correctly, you can now continue enjoying.'
  };
};
