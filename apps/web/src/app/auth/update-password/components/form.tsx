'use client';

import {useFormAction} from '@/hooks';
import {Button, Input} from '@formizee/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@formizee/ui/form';
import {LoadingIcon} from '@formizee/ui/icons';
import Link from 'next/link';
/* eslint-disable-next-line import/named -- Currently useFormState and useFormStatus are experimental */
import {useFormState, useFormStatus} from 'react-dom';
import {useFormContext} from 'react-hook-form';
import {type UpdatePasswordFormValues, updatePassword} from '../actions';

export function UpdatePasswordForm(): JSX.Element {
  const [state, formAction] = useFormState(updatePassword, null);

  const form = useFormAction<UpdatePasswordFormValues>({
    state,
    defaultValues: {
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
        name="password"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <Input
                autoComplete="off"
                placeholder="Enter your new password"
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
        {pending ? <LoadingIcon className="h-10 w-10" /> : 'Update Account'}
      </Button>
      <Button asChild className="mb-4" disabled={pending} variant="outline">
        <Link href="/login">Go Back</Link>
      </Button>
    </div>
  );
}

export default UpdatePasswordForm;
