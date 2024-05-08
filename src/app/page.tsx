import {Navbar, Spotlight} from '@/components';
import Cards from '@/components/cards';
import {WaitlistForm} from '@/components/forms';

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip bg-black lg:justify-center">
      <Spotlight className="absolute -left-10 -top-40 lg:-left-0" />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <Navbar />
      <header className="z-10 flex w-full flex-col-reverse justify-between lg:flex-row lg:items-center">
        <div className="ml-4 flex flex-col items-start gap-y-4 sm:ml-8 md:gap-y-8 lg:ml-8 xl:ml-24 2xl:ml-64">
          <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-semibold leading-[1.2] text-transparent sm:text-5xl">
            Forms Backend
            <br />
            Built for developers.
          </h1>
          <p className="text-md w-full text-balance text-neutral-400 sm:text-lg">
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
