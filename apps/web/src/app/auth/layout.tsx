import {Transition} from '@/components';

const AuthLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white opacity-5 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_60%)]"></div>
      <div className="pointer-events-none absolute inset-0 z-10 flex justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="bg-grid-pattern pointer-events-none absolute inset-0" />
      <Transition className="z-20 flex flex-col px-5">{children}</Transition>
    </main>
  );
};

export default AuthLayout;