import {ThemeToggle} from '@/components/theme';
import {Button, Input} from '@formizee/ui';
import {signIn} from '@/lib/auth';
import * as React from 'react';
import {z} from 'zod';

const searchParamsSchema = z.object({
  redirectTo: z.string().optional().default('/')
});

export default async function Login({
  searchParams
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const search = searchParamsSchema.safeParse(searchParams);
  const redirectTo = search.success ? search.data.redirectTo : '/';

  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <h1 className="text-2xl font-medium mb-8 font-mono">Login</h1>
      <section className="flex flex-col gap-4 w-[300px]">
        <form
          className="gap-4 flex flex-col items-center justify-center"
          action={async formData => {
            'use server';
            await signIn('resend', formData);
          }}
        >
          <Input
            required
            type="email"
            name="email"
            placeholder="example@formizee.com"
          />
          <Button className="w-full" variant="outline" type="submit">
            Get Started
          </Button>
        </form>
        <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 w-full" />
        <form
          action={async () => {
            'use server';
            await signIn('github', {redirectTo});
          }}
        >
          <Button className="w-full" variant="outline" type="submit">
            Login with Github
          </Button>
        </form>
        <form
          action={async () => {
            'use server';
            await signIn('google', {redirectTo});
          }}
        >
          <Button className="w-full" variant="outline" type="submit">
            Login with Google
          </Button>
        </form>
      </section>
      <ThemeToggle className="mt-8" />
    </main>
  );
}
