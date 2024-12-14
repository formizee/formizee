'use client';

import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import Image from 'next/image';

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <Transition className="z-20 flex flex-col px-5">
        <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
          <Image
            alt="Formizee Logo."
            className="rounded-xl border-4 border-neutral-200 dark:border-neutral-800"
            height={80}
            src="/logo.svg"
            width={80}
          />
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl">
            Something wen&apos;t wrong
          </h1>
          <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
            It seems like something unexpected happened. We&apos;re looking into
            it right now.
          </p>
          <code className="rounded-md bg-red-800/50 px-2 py-1 font-mono text-red-200 text-sm">
            Internal Digest: {error.digest}
          </code>
        </header>
        <Button onClick={reset}>Try Again</Button>
      </Transition>
    </main>
  );
}
