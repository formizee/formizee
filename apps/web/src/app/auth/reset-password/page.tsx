import Form from './components/form';
import Image from 'next/image';

const ResetPassword = () => {
  return (
    <>
      <header className="mb-11 flex w-full flex-col items-center gap-10 sm:mb-8 sm:items-start sm:gap-6">
        <Image
          className="z-[999] rounded-xl border border-neutral-800 shadow-md shadow-neutral-950"
          width={64}
          height={64}
          src="/logo.svg"
          alt="Formizee Logo."
        />
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-xl font-bold text-transparent">
          Reset Your Password
        </h1>
        <p className="max-w-96 text-balance text-center sm:text-wrap sm:text-start">
          Include the email address associated with your account and we’ll send
          you an email with instructions to reset your password.
        </p>
      </header>
      <Form />
    </>
  );
};

export default ResetPassword;
