import Image from 'next/image';
import Form from '../components/update-form';

function UpdatePassword(): JSX.Element {
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
          Update Your Password
        </h1>
        <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
          Time for a fresh start! Create a new password that&apos;s at least 8 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and symbols for maximum security.
        </p>
      </header>
      <Form />
    </>
  );
}

export default UpdatePassword;
