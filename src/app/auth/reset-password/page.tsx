import {Logo} from '@/components';
import {ResetPasswordForm} from '@/components/forms';
import {Card} from '@/components/ui';

const ResetPassword = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-white opacity-10 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent)]"></div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <Logo size="lg" className="z-10 mb-8" />
      <Card variant="auth" size="auth">
        <div className="flex w-96 flex-col items-start gap-4">
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p>
            Include the email address associated with your account and we’ll
            send you an email with instructions to reset your password.
          </p>
        </div>
        <ResetPasswordForm />
      </Card>
    </main>
  );
};

export default ResetPassword;
