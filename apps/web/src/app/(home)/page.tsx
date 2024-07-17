import {Footer, Navbar} from '@/components';
import {Cards, Form, Spotlight} from './components';

function Home(): JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-clip bg-black lg:h-screen lg:justify-center">
      <Spotlight
        fill="#fffbeb"
        className="sm:-left-10 sm:-top-40 lg:-left-0 absolute top-72 left-20"
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      <div className="zoom-out-100 fade-out-100 pointer-events-none fixed inset-0 scale-105 animate-out overflow-clip bg-grid-pattern fill-mode-forwards opacity-0 delay-800 duration-1000" />
      <Navbar className="fade-out-100 animate-out fill-mode-forwards opacity-0 delay-100 duration-1000" />
      <header className="z-10 flex w-full animate-fade-in flex-col-reverse justify-evenly fill-mode-forwards opacity-0 delay-100 duration-800 lg:h-full lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex flex-col items-start justify-center gap-y-4 p-3 px-4 sm:gap-y-6 sm:pl-14 lg:h-full lg:pl-14 xl:pl-28 2xl:pl-56">
          <h1 className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text font-bold text-3xl text-transparent leading-[1.4] sm:font-semibold sm:text-5xl sm:leading-[1.15]">
            <span className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-shadow-[-0.8px_-0.8px_0_#ffffff20]">
              Forms Backend
            </span>
            <br />
            <span className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-shadow-[-0.8px_-0.8px_0_#ffffff30]">
              Built for{' '}
            </span>
            <span className="animate-heading-accent bg-[linear-gradient(90deg,theme(colors.white),theme(colors.neutral.100),theme(colors.amber.200),theme(colors.amber.500))] bg-clip-text font-semibold text-transparent [-webkit-text-stroke:0.3px_#ffffff60] [background-size:200%]">
              developers
            </span>
            .
          </h1>
          <h2 className="text-lg text-neutral-300 sm:mb-3">
            The modern way of build your forms
            <br />
            Just keeping things simple.
          </h2>
          <Form />
        </div>
        <Cards />
      </header>
      <Footer className="fade-out-100 animate-out fill-mode-forwards opacity-0 delay-100 duration-1000" />
    </main>
  );
}

export default Home;
