import formIcon from '@/../../public/form.webp';
import {Transition} from '@/components';
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <Transition className="flex flex-col max-w-[50rem] gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <Image
            priority
            alt="Form"
            className="z-[999] dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            height={64}
            src={formIcon}
            width={64}
          />
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            Form not found
          </h1>
        </header>
        <section className="flex flex-col gap-4 items-center max-w-[500px]">
          <p className="flex flex-col p-1 text-balance text-center text-neutral-700 dark:text-neutral-300">
            <span className="font-medium">
              The form you&apos;re seeking seems to have taken a coffee break.
            </span>
          </p>
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
};

export default NotFound;
