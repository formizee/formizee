'use client';

/* eslint-disable-next-line import/named -- Currently useFormState and useFormStatus are experimental */
import {useFormState, useFormStatus} from 'react-dom';
import {useFormContext} from 'react-hook-form';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@formizee/ui/form';
import {Button, Input} from '@formizee/ui';
import {LoadingIcon, MailIcon} from '@formizee/ui/icons';
import {joinWaitlist, type JoinWaitlistFormValues} from '@/useCases/waitlist';
import {useFormAction} from '@/hooks';

export function WaitlistForm(): JSX.Element {
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
}

function FormFields(): JSX.Element {
  const form = useFormContext();
  const {pending} = useFormStatus();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
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
        <Button className="gap-x-2" disabled={pending}>
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
}

export default WaitlistForm;
