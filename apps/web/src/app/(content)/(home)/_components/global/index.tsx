import {Globe} from '@/components/globe';

export const Global = () => {
  return (
    <article className="relative flex flex-col items-center justify-center w-full max-w-96 h-80 overflow-hidden rounded-lg border dark:border-neutral-800 pt-0 pb-52 sm:pb-60 sm:pt-8 md:pb-60 shadow-sm">
      <h4 className="text-2xl font-bold">Global Low Latency</h4>
      <p className="font-secondary font-medium text-neutral-400 dark:text-neutral-600 mt-2 text-md">
        Built on the edge
      </p>
      <Globe className="top-32 sm:top-24" />
    </article>
  );
};
