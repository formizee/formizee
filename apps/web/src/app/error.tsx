'use client';

import Image from 'next/image';
import {Button} from '@formizee/ui';
import {Transition} from '@/components';

export default function Error({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white opacity-5 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 flex justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <Transition className="z-20 flex flex-col px-5">
        <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
          <Image
            alt="Formizee Logo."
            className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
            height={64}
            src="/logo.svg"
            width={64}
          />
          <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-xl font-bold text-transparent">
            Something Went Wrong!
          </h1>
          <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
            It seems like something unexpected happened. We&apos;re looking into
            it right now.
          </p>
          <code className="rounded-md bg-red-800/50 px-2 py-1 font-mono text-sm text-red-200">
            Internal Digest: {error.digest}
          </code>
        </header>
        <Button onClick={reset}>Try Again</Button>
      </Transition>
    </main>
  );
}
