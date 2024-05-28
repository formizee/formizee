import Image from 'next/image';
import Form from './components/form';
import { Transition } from '@/components';

function Verify(): JSX.Element {
  return (
    <Transition>
      <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
        <Image
          alt="Formizee Logo."
          className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
          height={64}
          src="/logo.svg"
          width={64}
        />
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-xl font-bold text-transparent">
          Verify Your Identity
        </h1>
        <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
          Enter the 6-digit code you received via email. Check your spam folder if you don't see it.
        </p>
      </header>
      <Form />
    </Transition>
  );
}

export default Verify;
