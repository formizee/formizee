import {Transition} from '@/components';
import {LoginForm} from './form';
import Image from 'next/image';
import Link from 'next/link';
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
    <main className="w-full flex flex-col min-h-screen items-center justify-center p-8">
      <Transition className="flex flex-col max-w-96 gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <Image
            alt="Formizee"
            className="z-[999] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            height={64}
            src="/logo.svg"
            width={64}
          />
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            Log In To Formizee
          </h1>
        </header>
        <LoginForm redirectTo={redirectTo} />
        <p className="text-balance text-center text-neutral-600 dark:text-neutral-400 text-xs">
          {'By signing in, you agree to our '}
          <Link
            className="underline underline-offset-2 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
            href="https://formizee.com/legal/terms-of-service"
          >
            Terms of Service
          </Link>
          {' and '}{' '}
          <Link
            className="underline underline-offset-2 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
            href="https://formizee.com/legal/privacy-policy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Transition>
    </main>
  );
}
