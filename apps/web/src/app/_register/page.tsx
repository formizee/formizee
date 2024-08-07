import Image from 'next/image';
import Link from 'next/link';
import Form from './components/form';

function Register(): JSX.Element {
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
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-transparent text-xl">
          Create a Formizee account
        </h1>
      </header>
      <Form />
      <p className="text-balance text-center text-neutral-400 text-xs">
        {'By signing up, you agree to our '}
        <Link
          className="underline underline-offset-2 transition-colors hover:text-neutral-50"
          href="/legal/terms-of-service"
        >
          Terms of Service
        </Link>
        {' and '}{' '}
        <Link
          className="underline underline-offset-2 transition-colors hover:text-neutral-50"
          href="/legal/privacy-policy"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}

export default Register;
