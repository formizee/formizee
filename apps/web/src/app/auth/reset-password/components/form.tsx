'use client';

/* eslint-disable-next-line import/named -- Currently useFormState and useFormStatus are experimental */
import { useFormState, useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';
import Link from 'next/link';
import type { ResetPasswordFormValues } from '@/useCases/auth';
import { resetPassword } from '@/useCases/auth';
import { useFormAction } from '@/hooks';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input
} from '@/components/ui';
import { LoadingIcon } from '@/components/ui/icons';

export function ResetPasswordForm(): JSX.Element {
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

function FormFields(): JSX.Element {
  const form = useFormContext();
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
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
        rules={{ required: true }}
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
