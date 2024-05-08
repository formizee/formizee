'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

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

const formSchema = z.object({
  email: z.string().email()
});

export const ResetPasswordForm = () => {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4">
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
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4">
          <span>Send Reset Email</span>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Go Back</Link>
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
