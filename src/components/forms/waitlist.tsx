'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { z } from 'zod';

import { MailIcon } from '../ui/icons';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input
} from '@/components/ui';

const formSchema = z.object({
  email: z.string().email()
});

export const WaitlistForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            name="email"
            rules={{ required: true }}
            control={form.control}
            render={({ field }) => (
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
          <Button className="gap-x-2">
            <MailIcon />
            <span>Join The Waitlist</span>
          </Button>
        </div>
        <p className="mt-3 text-balance text-center text-xs text-neutral-400">
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
      </form>
    </Form>
  );
};

export default WaitlistForm;
