import {Logo} from '@/components';
import {ResetPasswordForm} from '@/components/forms';

const ResetPassword = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <Logo size="lg" className="mb-8" />
      <div className="flex w-96 flex-col items-start gap-4">
        <h1 className="text-3xl font-semibold">Reset your password</h1>
        <p>
          Include the email address associated with your account and we’ll send
          you an email with instructions to reset your password.
        </p>
      </div>
      <ResetPasswordForm />
    </main>
  );
};

export default ResetPassword;
