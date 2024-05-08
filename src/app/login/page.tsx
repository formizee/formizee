import {Logo} from '@/components';
import {Card} from '@/components/ui';
import {LoginForm} from '@/components/forms';

const Login = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-white opacity-10 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent)]"></div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)] dark:bg-black"></div>
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <Logo size="lg" className="z-10 mb-8" />
      <Card variant="auth" size="auth">
        <LoginForm />
      </Card>
    </main>
  );
};

export default Login;
