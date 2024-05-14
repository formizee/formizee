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

export const ResetPasswordForm = () => {
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
            <FormControl>
              <Input
                required
                type="email"
                autoComplete="off"
                placeholder="Enter your email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={pending} className="mt-4">
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Send Reset Email'}
      </Button>
      <Button disabled={pending} className="mb-4" variant="outline" asChild>
        <Link href="/login">Go Back</Link>
      </Button>
    </div>
  );
};

export default ResetPasswordForm;
