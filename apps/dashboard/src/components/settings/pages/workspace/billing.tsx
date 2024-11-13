import Transition from '@/components/transition';
import cardIcon from '@/../public/card.webp';
import Image from 'next/image';

export const SettingsWorkspaceBilling = () => {
  return (
    <Transition className="flex flex-col w-full">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
        <div className="flex flex-row gap-4">
          <Image
            height={48}
            width={48}
            src={cardIcon}
            alt="Credit Card Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col gap-1 items-start">
            <span className="font-medium">Billing</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The payment settings of the workspace
            </p>
          </div>
        </div>
      </section>
    </Transition>
  );
};
