import {Navbar, Footer} from '@/components';
import {Form, Cards, Spotlight} from './components';

function Home(): JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-clip bg-black lg:h-screen lg:justify-center">
      <Spotlight
        fill="#fffbeb"
        className="absolute -left-10 -top-40 lg:-left-0"
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      <div className="animate-out zoom-out-100 delay-800 fill-mode-forwards fade-out-100 bg-grid-pattern pointer-events-none fixed inset-0 scale-105 overflow-clip opacity-0 duration-1000" />
      <Navbar className="animate-out fill-mode-forwards fade-out-100 opacity-0 delay-100 duration-1000" />
      <header className="animate-fade-in duration-800 fill-mode-forwards z-10 flex w-full flex-col-reverse justify-evenly opacity-0 delay-100 lg:h-full lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex flex-col items-start justify-center gap-y-4 p-3 px-4 sm:gap-y-6 sm:pl-14 lg:h-full lg:pl-14 xl:pl-28 2xl:pl-56">
          <h1 className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-3xl font-bold leading-[1.4] text-transparent sm:text-5xl sm:font-semibold sm:leading-[1.15]">
            <span className="text-shadow-[-0.8px_-0.8px_0_#ffffff20] bg-gradient-to-b from-white to-neutral-500 bg-clip-text">
              Forms Backend
            </span>
            <br />
            <span className="text-shadow-[-0.8px_-0.8px_0_#ffffff30] bg-gradient-to-b from-white to-neutral-500 bg-clip-text">
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
      <Footer className="animate-out fill-mode-forwards fade-out-100 opacity-0 delay-100 duration-1000" />
    </main>
  );
}

export default Home;
