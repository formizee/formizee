import Transition from '@/components/transition';
import {Skeleton} from '@formizee/ui';

export const WorkspaceKeysPageLoading = () => (
  <Transition className="flex flex-col w-full">
    <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
      <div className="flex flex-row gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <Skeleton className="w-[7.3rem] h-10" />
    </section>
    <Skeleton className="mt-4 w-full h-10" />
    <Skeleton className="mt-4 w-full h-32" />
  </Transition>
);
