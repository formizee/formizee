'use client';

import {Transition} from '@/components';
import {Button} from '@formizee/ui';

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Transition className="z-20 flex flex-col px-5 text-neutral-950 dark:text-neutral-50 items-center gap-4">
        <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-5xl">
          500
        </h1>
        <h2 className="text-neutral-950 dark:text-neutral-50 font-semibold text-xl">
          Something wen&apos;t wrong
        </h2>
        <p className="max-w-96 text-balance text-center mt-2">
          It seems like something unexpected happened. We&apos;re looking into
          it right now.
        </p>
        <code className="mt-4 max-w-2/6 max-h-96 overflow-clip rounded-md bg-red-200/50 dark:bg-red-800/50 px-2 py-1 font-mono text-red-800 dark:text-red-200 text-sm">
          name: {error.name}
          <br />
          digest: {error.digest}
          <br />
          message: {error.message}
        </code>
        <Button
          onClick={reset}
          className="max-w-32 mt-4 font-secondary border-2 hover:border-neutral-500 border-neutral-700 bg-neutral-900"
        >
          Try Again
        </Button>
      </Transition>
    </main>
  );
}
