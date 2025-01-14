'use client';

import {UndoIcon} from '@formizee/ui/icons';
import * as Sentry from '@sentry/nextjs';
import {Transition} from '@/components';
import logo from '@/../public/logo.svg';
import {Button} from '@formizee/ui';
import {useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <Transition className="flex flex-col max-w-[50rem] gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <Image
            priority
            alt="Formizee"
            className="z-[999] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            height={64}
            src={logo}
            width={64}
          />
          <h1 className="text-balance text-center text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            Something Went Wrong!
          </h1>
        </header>
        <section className="flex flex-col gap-4 items-center max-w-[500px]">
          <p className="max-w-96 text-neutral-600 dark:text-neutral-400 text-balance text-center sm:text-wrap sm:text-start">
            It seems like something unexpected happened. We&apos;re looking into
            it right now.
          </p>
          <code className="rounded-md bg-red-200 dark:bg-red-800/50 px-2 py-1 font-mono text-neutral-800 dark:text-red-200 text-sm">
            {error.message}
          </code>
          <Button onClick={reset} className="group mt-4 w-full max-w-96">
            Try Again
            <UndoIcon className="transition-all -ml-2 group-hover:ml-0 w-0 opacity-0 group-hover:w-4 group-hover:opacity-100" />
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
