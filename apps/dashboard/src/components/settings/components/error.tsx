import Transition from '@/components/transition';
import errorIcon from '@/../public/error.webp';
import Image from 'next/image';

export const PageError = () => (
  <Transition className="flex flex-col w-full h-full items-center justify-center">
    <Image
      src={errorIcon}
      alt="Error Icon"
      width={64}
      height={64}
      className="dark:rounded-[0.65rem] -mt-10 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
    />
    <span className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold mt-8">
      Uh-oh! Something didn’t load right
    </span>
    <p className="max-w-[500px] mt-4 text-center text-neutral-600 dark:text-neutral-400">
      The page failed to load as expected. You may want to refresh or check your
      connection.
    </p>
    <p className="fixed bottom-4 mt-16 text-center text-sm text-neutral-600 dark:text-neutral-400">
      If the problem persists, please contact with{' '}
      <a href="mailto:support@formizee.com" className="underline">
        support@formizee.com
      </a>
    </p>
  </Transition>
);
