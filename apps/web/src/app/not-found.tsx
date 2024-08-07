import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import {ArrowRightIcon} from '@formizee/ui/icons';
import Image from 'next/image';
import Link from 'next/link';

function NotFound(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white opacity-5 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 flex justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
      <Transition className="z-20 flex flex-col px-5">
        <header className="mb-11 flex w-full flex-col items-center gap-10">
          <Image
            alt="Formizee Logo."
            className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
            height={64}
            src="/logo.svg"
            width={64}
          />
          <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-transparent text-xl">
            Page Not Found
          </h1>
          <h2 className="max-w-96 gap-y-2 text-center text-semibold text-xl">
            The page you&apos;re seeking seems to have taken a coffee break.
          </h2>
        </header>
        <div className="flex flex-col items-center">
          <Button asChild className="px-8">
            <Link href="/">
              Return To Homepage
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </Transition>
    </main>
  );
}

export default NotFound;
