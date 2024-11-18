import Transition from '@/components/transition';
import {Skeleton} from '@formizee/ui';

export const WorkspacePlansPageLoading = () => (
  <Transition className="flex flex-col w-full">
    <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
      <div className="flex flex-row gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    </section>
    <div className="flex flex-row w-full h-full gap-4 mt-4 mb-2">
      <Skeleton className="w-full h-full flex-1" />
      <Skeleton className="w-full h-full flex-1" />
    </div>
  </Transition>
);
