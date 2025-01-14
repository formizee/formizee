'use client';

import errorIcon from '@/../public/error.webp';
import {useRouter} from 'next/navigation';
import {Transition} from '@/components';
import Image from 'next/image';
import {Button} from '@formizee/ui';
import {ReloadIcon} from '@formizee/ui/icons';

export const ChartError = () => {
  const router = useRouter();

  return (
    <Transition className="flex flex-col items-center justify-center border dark:border-neutral-800 w-full h-[450px] mt-4 rounded-md">
      <Image
        priority
        src={errorIcon}
        alt="Error Icon"
        width={64}
        height={64}
        className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
      />
      <span className="px-4 w-full flex flex-col text-center gap-6 items-center text-left text-xl font-bold mt-8">
        Uh-oh! Something didn’t load right
      </span>
      <p className="max-w-[500px] px-4 mt-4 text-center text-balance text-neutral-600 dark:text-neutral-400">
        The analytics data failed to load as expected. You may want to refresh
        or check your connection.
      </p>
      <Button
        className="mt-8"
        variant="outline"
        onClick={() => router.refresh()}
      >
        Reload Page
        <ReloadIcon />
      </Button>
      <p className="fixed bottom-4 px-4 mt-16 text-center text-sm text-neutral-600 dark:text-neutral-400">
        If the problem persists, please contact with{' '}
        <a href="mailto:support@formizee.com" className="underline">
          support@formizee.com
        </a>
      </p>
    </Transition>
  );
};
