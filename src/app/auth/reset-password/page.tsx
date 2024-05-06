import {Logo} from '@/components';
import {ResetPasswordForm} from '@/components/forms';

const ResetPassword = () => {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-center p-24">
      <Logo size="lg" className="mb-8" />
      <div className="flex flex-col items-start gap-4 w-96">
        <h1 className="font-semibold text-3xl">Reset your password</h1>
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
