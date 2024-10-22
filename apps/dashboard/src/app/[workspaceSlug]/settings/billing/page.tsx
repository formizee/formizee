import cardIcon from '@/../public/card.webp';
import Transition from '@/components/transition';
import Image from 'next/image';

const Billing = async () => {
  return (
    <Transition className="flex flex-col py-6 gap-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-8">
        <div className="flex flex-row gap-4">
          <Image
            height={56}
            width={56}
            src={cardIcon}
            alt="Credit Card Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Billing</span>
            <p>The payment settings of the workspace</p>
          </div>
        </div>
      </section>
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 h-96" />
    </Transition>
  );
};

export default Billing;
