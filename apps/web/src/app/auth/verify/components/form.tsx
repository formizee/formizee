'use client';

/* eslint-disable-next-line import/named -- Currently useFormState and useFormStatus are experimental */
import {useFormState, useFormStatus} from 'react-dom';
import {useFormContext} from 'react-hook-form';
import Link from 'next/link';
import {
  Button,
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator
} from '@formizee/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@formizee/ui/form';
import {LoadingIcon} from '@formizee/ui/icons';
import {useFormAction} from '@/hooks';
import {verifyToken, type VerifyTokenFormValues} from '../actions';

export function VerifyForm(): JSX.Element {
  const [state, formAction] = useFormState(verifyToken, null);

  const form = useFormAction<VerifyTokenFormValues>({
    state,
    defaultValues: {
      token: ''
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
        name="token"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <InputOTP maxLength={6} {...field}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
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
        <Link href="/login">Go Back</Link>
      </Button>
    </div>
  );
}

export default VerifyForm;
