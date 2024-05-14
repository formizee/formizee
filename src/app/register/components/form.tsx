'use client';

import {RegisterFormValues, register} from '@/useCases/auth';
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
  const [state, formAction] = useFormState(register, null);

  const form = useFormAction<RegisterFormValues>({
    state,
    defaultValues: {
      name: '',
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
        name="name"
        control={form.control}
        rules={{required: true}}
        render={({field}) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                required
                type="text"
                autoComplete="off"
                placeholder="username"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
            <FormLabel>Password</FormLabel>
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
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Create Account'}
      </Button>
      <Button disabled={pending} className="mb-4" variant="outline" asChild>
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  );
};

export default LoginForm;
