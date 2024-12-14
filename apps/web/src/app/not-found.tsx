import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import Link from 'next/link';

function NotFound(): JSX.Element {
  return (
    <main className="flex flex-grow flex-col items-center justify-center bg-white dark:bg-black">
      <Transition className="z-20 flex flex-col px-5">
        <header className="mb-11 flex w-full flex-col items-center gap-4">
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-6xl">
            404
          </h1>
          <p className="max-w-96 gap-y-2 text-center">
            The page you&apos;re seeking seems to have taken a coffee break.
          </p>
        </header>
        <div className="flex flex-col items-center">
          <Button
            asChild
            className="max-w-48 mt-4 font-secondary border-2 hover:border-neutral-500 border-neutral-700 bg-neutral-900"
          >
            <Link href="/">Return To Homepage</Link>
          </Button>
        </div>
      </Transition>
    </main>
  );
}

export default NotFound;
