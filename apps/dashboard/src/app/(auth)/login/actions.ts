import type {ActionState} from '@/types';
import {redirect} from 'next/navigation';
import {signIn} from '@/lib/auth';
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

  const response = await signIn('credentials', input.data);

  if (response.status === 403) {
    redirect('/auth/verify');
  } else {
    redirect('/');
  }
};
