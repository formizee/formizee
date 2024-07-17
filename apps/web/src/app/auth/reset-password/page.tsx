import {Transition} from '@/components';
import Image from 'next/image';
import Form from './components/form';

function ResetPassword(): JSX.Element {
  return (
    <Transition className="z-20 flex flex-col px-5">
      <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
        <Image
          alt="Formizee Logo."
          className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
          height={64}
          src="/logo.svg"
          width={64}
        />
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-transparent text-xl">
          Reset Your Password
        </h1>
        <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
          Include the email address associated with your account and we’ll send
          you an email with instructions to reset your password.
        </p>
      </header>
      <Form />
    </Transition>
  );
}

export default ResetPassword;
