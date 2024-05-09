import {Navbar, Transition} from '@/components';

const PrivacyPolicy = () => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      <Navbar />
      <Transition className="mt-20 flex w-[800px] flex-col items-start">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-4xl font-semibold text-transparent">
          Privacy Policy
        </h1>
      </Transition>
    </main>
  );
};

export default PrivacyPolicy;
