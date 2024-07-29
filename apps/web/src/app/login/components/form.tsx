'use client';

import {useFormAction} from '@/hooks';
import {Button, Input} from '@formizee/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@formizee/ui/form';
import {LoadingIcon} from '@formizee/ui/icons';
import Link from 'next/link';
/* eslint-disable-next-line import/named -- Currently useFormState and useFormStatus are experimental */
import {useFormState, useFormStatus} from 'react-dom';
import {useFormContext} from 'react-hook-form';
import {type LoginFormValues, login} from '../actions';

export function LoginForm(): JSX.Element {
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
}

function FormFields(): JSX.Element {
  const form = useFormContext();
  const {pending} = useFormStatus();

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({field}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="you@mail.com"
                required
                type="email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        rules={{required: true}}
      />
      <FormField
        control={form.control}
        name="password"
        render={({field}) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Button asChild className="h-6 px-0" variant="link">
                <Link href="/auth/reset-password" tabIndex={-1}>
                  Forgot your password?
                </Link>
              </Button>
            </div>
            <FormControl>
              <Input
                placeholder="********"
                required
                type="password"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        rules={{required: true}}
      />
      <Button className="mt-4" disabled={pending}>
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Continue'}
      </Button>
      <Button asChild className="mb-4" disabled={pending} variant="outline">
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  );
}

export default LoginForm;
