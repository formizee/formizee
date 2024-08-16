import formIcon from '@/../../public/form.webp';
import {Transition} from '@/components';
import Image from 'next/image';

const EmptyPage = () => {
  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <Transition className="flex flex-col max-w-[50rem] gap-4">
        <header className="mb-8 flex w-full flex-col items-center sm:items-start gap-8">
          <Image
            alt="Form"
            className="z-[999] dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
            height={64}
            src={formIcon}
            width={64}
          />
          <h1 className="text-neutral-950 dark:text-neutral-50 font-bold text-xl sm:text-xl">
            Welcome to Formizee
          </h1>
        </header>
        <section className="flex flex-col gap-4 items-center max-w-[500px]">
          <p className="flex flex-col p-1 text-balance text-center text-neutral-700 dark:text-neutral-300">
            <span className="text-lg font-medium">
              Create a new form to start building!
            </span>
          </p>
        </section>
      </Transition>
    </main>
  );
};

export default EmptyPage;
