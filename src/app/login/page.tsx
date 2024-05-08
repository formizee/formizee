import {LoginForm} from '@/components/forms';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white opacity-5 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_60%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-10 flex justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <div className="z-20 flex flex-col px-5">
        <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
          <Image
            className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
            width={64}
            height={64}
            src="/logo.svg"
            alt="Formizee Logo."
          />
          <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-xl font-bold text-transparent">
            Login To Formizee.
          </h1>
        </header>
        <LoginForm />
        <p className="text-balance text-center text-xs text-neutral-400">
          {'By signing in, you agree to our '}
          <Link
            className="underline underline-offset-2 transition-colors hover:text-neutral-50"
            href="/legal/terms-of-service">
            Terms of Service
          </Link>
          {' and '}{' '}
          <Link
            className="underline underline-offset-2 transition-colors hover:text-neutral-50"
            href="/legal/privacy-policy">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
};

export default Login;
