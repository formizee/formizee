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

export function LoginForm() {
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
}

function FormFields() {
  const form = useFormContext();
  const {pending} = useFormStatus();

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({field}) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="username"
                required
                type="text"
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
            <FormLabel>Password</FormLabel>
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
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Create Account'}
      </Button>
      <Button asChild className="mb-4" disabled={pending} variant="outline">
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  );
}

export default LoginForm;
