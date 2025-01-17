import {Transition} from '@/components';
import {Skeleton} from '@formizee/ui';

export const LoadingSkeleton = () => (
  <Transition className="border dark:border-neutral-800 w-full h-[560px] mt-4 rounded-md">
    <header className="flex items-center gap-2 space-y-0 border-b dark:border-b-neutral-800 py-5 px-2 justify-between">
      <div className="flex flex-row justify-between w-full max-w-[450px]">
        <div className="flex flex-col flex-1 px-2 items-start border-r dark:border-r-neutral-800 gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-12 rounded-xl" />
        </div>
        <div className="flex flex-col flex-1 px-2 items-start gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-12 rounded-xl" />
        </div>
      </div>
      <Skeleton className="hidden sm:flex h-8 w-40 mr-4" />
    </header>
  </Transition>
);
