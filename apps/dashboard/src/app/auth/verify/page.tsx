import emailIcon from '@/../public/email.webp';
import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';
import Image from 'next/image';
import {Button} from '@formizee/ui';
import Link from 'next/link';
import {LinkIcon} from '@formizee/ui/icons';
import {Transition} from '@/components';

export default async function AuthVerify() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <main className="w-full flex flex-col min-h-dvh gap-4 items-center justify-center p-24">
      <Transition className="flex flex-col max-w-[50rem] gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <div className="dark:reflection dark:shadow-[0_0_60px_15px_rgba(252,211,77,0.1)]">
            <Image
              priority
              alt="Email"
              className="z-[999] rounded-xl border-4 dark:border-neutral-600 border-neutral-300 shadow-[0_0_60px_12px_rgba(217,119,6,0.5)]"
              src={emailIcon}
              height={64}
              width={64}
            />
          </div>
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            Check your inbox
          </h1>
        </header>
        <section className="flex flex-col gap-4 items-center max-w-[500px]">
          <p className="text-balance text-center text-neutral-700 dark:text-neutral-300">
            We've sent a magic link to your email address. Please check your
            inbox and click on the link to log in.
          </p>
          <Button asChild className="group mt-4 w-full max-w-96">
            <Link href="https://gmail.com" target="_blank">
              Open In Gmail
              <LinkIcon className="transition-all -ml-2 group-hover:ml-0 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100" />
            </Link>
          </Button>
          <span className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
            Need help?{'  '}
            <Link
              className="transition-colors underline-offset-2 underline hover:text-neutral-950 dark:hover:text-neutral-50"
              href="mailto:support@formizee.com"
            >
              Contact support
            </Link>
          </span>
        </section>
      </Transition>
    </main>
  );
}
