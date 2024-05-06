import {Navbar} from '@/components';
import Cards from '@/components/cards';
import {WaitlistForm} from '@/components/forms';

const Home = () => {
  return (
    <main className="flex bg-black min-h-screen flex-col items-center justify-center p-24">
      <Navbar />
      <header className="flex justify-between container">
        <div className="flex flex-col gap-y-8 items-start">
          <h1 className="text-transparent bg-clip-text leading-[1.2] text-5xl bg-gradient-to-b from-white to-slate-400 font-semibold">
            Forms Backend
            <br />
            Built for developers.
          </h1>
          <p className="w-full text-neutral-400 text-lg">
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
