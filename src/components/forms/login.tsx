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
        className="flex flex-col gap-y-4">
        <FormField
          name="email"
          control={form.control}
          rules={{required: true}}
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  required
                  type="email"
                  autoComplete="off"
                  placeholder="you@mail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          rules={{required: true}}
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Button variant="link" asChild className="h-6 px-0">
                  <Link tabIndex={-1} href="/auth/reset-password">
                    Forgot your password?
                  </Link>
                </Button>
              </div>
              <FormControl>
                <Input
                  required
                  type="password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4">Continue</Button>
        <Button className="mb-4" variant="outline" asChild>
          <Link href="/">Go Back</Link>
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
