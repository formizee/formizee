import {ChevronRightIcon} from '@formizee/ui/icons';
import upgradeIcon from '@/../public/upgrade.webp';
import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import Image from 'next/image';
import Link from 'next/link';

export default async function Confirmation() {
  return (
    <main className="w-full flex flex-col min-h-screen items-center justify-center p-8">
      <Transition className="flex flex-col max-w-[40rem] gap-4 items-center">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <Image
            priority
            alt="Upgrade Icon"
            className="z-[999] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            height={64}
            src={upgradeIcon}
            width={64}
          />
        </header>
        <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
          Thanks for upgrade your Formizee Plan
        </h1>
        <p className="flex flex-col text-balance text-center text-neutral-600 dark:text-neutral-400 text-md mt-4 gap-4">
          <span>
            We’re busy setting up your dashboard to ensure everything is
            perfect. This might take a few moments, but rest assured, it’ll be
            worth the wait.
          </span>
          <span className="font-medium text-neutral-500 dark:text-neutral-300">
            we’re excited to have you on board!
          </span>
        </p>
        <Button
          type="button"
          className="group text-neutral-50 dark:text-neutral-950 w-64 mt-8"
          asChild
        >
          <Link href="/">
            Go To Dashboard
            <ChevronRightIcon className="transition-all w-0 rotate-90 opacity-0 group-hover:w-4 group-hover:rotate-0 group-hover:opacity-100" />
          </Link>
        </Button>
      </Transition>
    </main>
  );
}
