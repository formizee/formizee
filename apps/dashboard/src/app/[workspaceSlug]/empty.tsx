import workspaceIcon from '@/../../public/workspace.webp';
import { Transition } from '@/components';
import Image from 'next/image';

const EmptyPage = () => {
  return (
    <Transition className="flex flex-col w-full h-full items-center justify-center">
      <Image
        src={workspaceIcon}
        alt="Workspace Icon"
        width={64}
        height={64}
        className="dark:rounded-[0.65rem] -mt-16 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
      />
      <span className="w-full flex flex-col gap-6 items-center text-left text-xl font-bold mt-8">
        It’s Quiet Here…
      </span>
      <p className="max-w-[500px] mt-4 text-center text-neutral-600 dark:text-neutral-400">
        You haven’t created any forms yet, or maybe you’ve deleted them. Click
        “New” to add your first form and start collecting feedback today!
      </p>
      <p className="fixed bottom-4 mt-16 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Need help?{' '}
        <a href="mailto:support@formizee.com" className="underline">
          Contact Support
        </a>
      </p>
    </Transition>
  );
};

export default EmptyPage;
