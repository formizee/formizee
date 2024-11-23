import {Transition} from '@/components';
import {Skeleton} from '@formizee/ui';

export const WorkspaceBillingPageLoading = () => (
  <Transition className="flex flex-col w-full">
    <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
      <div className="flex flex-row gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex flex-col gap-2 items-start">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    </section>
    <Skeleton className="mt-8 w-40 h-6" />
    <Skeleton className="mt-2 w-full h-[1px]" />
    <div className="flex flex-row gap-2 mt-[1.2rem] justify-between">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="flex flex-row gap-2 mt-[1.2rem] justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-10" />
    </div>
    <Skeleton className="mt-16 w-40 h-6" />
    <Skeleton className="mt-2 w-full h-[1px]" />
    <div className="flex flex-row gap-2 mt-4 justify-between">
      <Skeleton className="h-4 w-36" />
      <div className="flex flex-row gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
    <div className="flex flex-row gap-2 mt-4 justify-between">
      <Skeleton className="h-4 w-36" />
      <div className="flex flex-row gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
    <div className="flex flex-row gap-2 mt-4 justify-between">
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-row gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
    <div className="flex flex-row gap-2 mt-4 justify-between">
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-row gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
    <div className="flex flex-row gap-2 mt-4 justify-between">
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-row gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
    <div className="fixed flex flex-row justify-between items-center bottom-0 w-full">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-44" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  </Transition>
);
