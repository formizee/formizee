import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui';

function WaitlistPage() {
  return (
    <>
      <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
        <Image
          alt="Formizee Logo."
          className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
          height={64}
          src="/logo.svg"
          width={64}
        />
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-xl font-bold text-transparent">
          You&apos;re In Waitlist
        </h1>
        <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
          You will have been granteed access to the closed beta when it
          launches. Thanks for joining with us.
        </p>
      </header>
      <Button asChild>
        <Link href="/">Let&apos;s Reimagine The Future</Link>
      </Button>
    </>
  );
}

export default WaitlistPage;
