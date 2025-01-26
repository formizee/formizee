import {redirect} from 'next/navigation';
import logo from '@/../public/logo.svg';
import {env} from '@/lib/enviroment';
import {auth} from '@/lib/auth';
import {z} from 'zod';

import {Transition} from '@/components';
import {LoginForm} from './form';
import Image from 'next/image';

const searchParamsSchema = z.object({
  redirectTo: z.string().optional().default('/')
});

export default async function Login({
  searchParams
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  const session = await auth();

  if (session?.user?.id) {
    redirect('/');
  }

  const search = searchParamsSchema.safeParse(searchParams);
  const redirectTo = search.success ? search.data.redirectTo : '/';

  return (
    <main className="w-full flex flex-col min-h-dvh items-center justify-center p-8">
      <Transition className="flex flex-col max-w-96 gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <Image
            priority
            alt="Formizee"
            className="z-[999] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            height={64}
            src={logo}
            width={64}
          />
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            Log In To Formizee
          </h1>
        </header>
        <LoginForm selfHosting={env().SELF_HOSTING} redirectTo={redirectTo} />
      </Transition>
    </main>
  );
}
