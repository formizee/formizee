import {Logo} from '@/components';
import {LoginForm} from '@/components/forms';

const Login = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <Logo size="lg" className="mb-8" />
      <LoginForm />
    </main>
  );
};

export default Login;
