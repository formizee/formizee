import {Transition} from '@/components';
import Image from 'next/image';

import integrationsIcon from '@/../public/integrations.webp';

export const FallbackCard = () => {
  return (
    <Transition className="flex flex-col items-center justify-center border border-dotted dark:border-neutral-800 w-full h-[450px] mt-4 rounded-md">
      <Image
        priority
        src={integrationsIcon}
        alt="Integrations Icon"
        width={64}
        height={64}
        className="dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
      />
      <span className="px-4 w-full flex flex-col text-center gap-6 items-center text-left text-xl font-bold mt-8">
        Integrations Coming Soon
      </span>
      <p className="max-w-[500px] px-4 mt-4 text-center text-balance text-neutral-600 dark:text-neutral-400">
        Streamline your workflow with powerful integrations to your favorite
        tools. We’ll email you as soon as it’s ready!
      </p>
    </Transition>
  );
};
