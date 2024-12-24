import {Globe} from '@/components/globe';

export const GlobeItem = () => {
  return (
    <article className="relative flex flex-col items-center justify-center w-full max-w-96 h-80 overflow-hidden rounded-lg border dark:border-neutral-800 pt-0 pb-48 sm:pb-40 sm:pt-8 md:pb-60">
      <h4 className="text-3xl font-bold">Global Low Latency</h4>
      <p className="font-secondary font-medium text-neutral-400 dark:text-neutral-600 mt-2 text-md">
        Built on the edge
      </p>
      <Globe className="top-32 sm:top-24" />
    </article>
  );
};
