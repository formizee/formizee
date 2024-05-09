import { Navbar, Transition } from '@/components';

const TermsOfService = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-black">
      <Navbar />
      <Transition>
        <h1 className="text-3xl font-semibold">Terms of service</h1>
      </Transition>
    </main>
  );
};

export default TermsOfService;
