import {Navbar} from '@/components';
import Cards from '@/components/cards';
import {WaitlistForm} from '@/components/forms';

const Home = () => {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center lg:justify-center">
      <Navbar />
      <header className="flex w-full flex-col-reverse lg:flex-row lg:items-center justify-between">
        <div className="ml-4 sm:ml-8 lg:ml-8 xl:ml-24 2xl:ml-64 flex flex-col gap-y-4 md:gap-y-8 items-start">
          <h1 className="text-transparent bg-clip-text leading-[1.2] text-3xl sm:text-5xl bg-gradient-to-b from-white to-slate-400 font-semibold">
            Forms Backend
            <br />
            Built for developers.
          </h1>
          <p className="w-full text-neutral-400 text-md sm:text-lg">
            The modern way to implement forms in your projects.
            <br /> <span className="text-white">Smooth</span>,{' '}
            <span className="text-white">Effortless</span> and{' '}
            <span className="text-white">Open Source</span>.
          </p>
          <WaitlistForm />
        </div>
        <Cards />
      </header>
    </main>
  );
};

export default Home;
