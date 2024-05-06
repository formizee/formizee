import {Logo} from '@/components';
import {LoginForm} from '@/components/forms';

const Login = () => {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-center p-24">
      <Logo size="lg" className="mb-8" />
      <LoginForm />
    </main>
  );
};

export default Login;
