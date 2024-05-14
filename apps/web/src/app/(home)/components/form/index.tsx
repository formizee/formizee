'use client';

import {JoinWaitlistFormValues, joinWaitlist} from '@/useCases/waitlist';
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
import {LoadingIcon, MailIcon} from '@/components/ui/icons';

export const WaitlistForm = () => {
  const [state, formAction] = useFormState(joinWaitlist, null);

  const form = useFormAction<JoinWaitlistFormValues>({
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
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField
          name="email"
          rules={{required: true}}
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  required
                  type="email"
                  placeholder="you@mail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending} className="gap-x-2">
          {pending ? <LoadingIcon className="-mr-2 h-6 w-6" /> : <MailIcon />}
          <span>Join The Waitlist</span>
        </Button>
      </div>
      <p className="mb-6 mt-3 text-balance text-start text-xs text-neutral-400">
        {'By joining, you agree to our '}
        <Link
          className="underline underline-offset-2 transition-colors hover:text-neutral-50"
          href="/legal/terms-of-service">
          Terms of Service
        </Link>
        {' and '}{' '}
        <Link
          className="underline underline-offset-2 transition-colors hover:text-neutral-50"
          href="/legal/privacy-policy">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
};

export default WaitlistForm;
