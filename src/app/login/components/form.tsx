'use client';

import {LoginFormValues, login} from '@/useCases/auth';
import {useFormState, useFormStatus} from 'react-dom';
import {useFormAction} from '@/hooks/useFormAction';
import {useFormContext} from 'react-hook-form';

import {
  Button,
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input
} from '@/components/ui';
import Link from 'next/link';
import {LoadingIcon} from '@/components/ui/icons';

export const LoginForm = () => {
  const [state, formAction] = useFormState(login, null);

  const form = useFormAction<LoginFormValues>({
    state,
    defaultValues: {
      email: '',
      password: ''
    }
  });

  return (
    <Form {...form}>
      <form action={formAction} className="flex flex-col gap-y-4">
        <FormFields />
      </form>
    </Form>
  );
};

const FormFields = () => {
  const form = useFormContext();
  const {pending} = useFormStatus();

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        name="email"
        control={form.control}
        rules={{required: true}}
        render={({field}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                required
                type="email"
                autoComplete="off"
                placeholder="you@mail.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        rules={{required: true}}
        control={form.control}
        name="password"
        render={({field}) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Button variant="link" asChild className="h-6 px-0">
                <Link tabIndex={-1} href="/auth/reset-password">
                  Forgot your password?
                </Link>
              </Button>
            </div>
            <FormControl>
              <Input
                required
                type="password"
                placeholder="********"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={pending} className="mt-4">
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Continue'}
      </Button>
      <Button disabled={pending} className="mb-4" variant="outline" asChild>
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  );
};

export default LoginForm;
