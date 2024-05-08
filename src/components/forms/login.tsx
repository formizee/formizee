'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

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
import {ArrowRightIcon} from '../ui/icons';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32)
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({values});
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-96 flex-col gap-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Button variant="link" asChild className="p-0">
                  <Link tabIndex={-1} href="/auth/reset-password">
                    Forgot your password?
                  </Link>
                </Button>
              </div>
              <FormControl>
                <Input placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="my-4 items-center gap-x-2">
          <span>Login</span>
          <ArrowRightIcon />
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
