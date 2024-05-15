'use client';

import {ResetPasswordFormValues, resetPassword} from '@/useCases/auth';
import {useFormState, useFormStatus} from 'react-dom';
import {useFormAction} from '@/hooks/useFormAction';
import {useFormContext} from 'react-hook-form';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input
} from '@/components/ui';
import Link from 'next/link';
import {LoadingIcon} from '@/components/ui/icons';

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, null);

  const form = useFormAction<ResetPasswordFormValues>({
    state,
    defaultValues: {
      email: ''
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
        name="email"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Enter your email"
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
      <Button className="mt-4" disabled={pending}>
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Send Reset Email'}
      </Button>
      <Button asChild className="mb-4" disabled={pending} variant="outline">
        <Link href="/login">Go Back</Link>
      </Button>
    </div>
  );
}

export default ResetPasswordForm;
