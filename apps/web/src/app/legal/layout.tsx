import {Navbar, Transition} from '@/components';

function LegalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-black">
      <Navbar />
      <Transition className="mx-6 my-28 max-w-[800px]">{children}</Transition>
    </main>
  );
}

export default LegalLayout;
