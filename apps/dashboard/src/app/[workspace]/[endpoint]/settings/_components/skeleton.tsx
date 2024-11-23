import {Transition} from '@/components';
import {Skeleton} from '@formizee/ui';

export const LoadingSkeleton = () => (
  <Transition className="flex flex-col w-full ml-2 items-start">
    <Skeleton className="mt-8 w-40 h-6" />
    <Skeleton className="mt-2 w-full h-[1px]" />
    <div className="flex flex-row gap-2 mt-4 items-end">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-96" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
    <div className="flex flex-row gap-2 mt-10 items-end">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-96" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
    <div className="flex flex-row gap-2 mt-10 items-end">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-96" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
    <Skeleton className="mt-8 w-40 h-6" />
    <Skeleton className="mt-2 w-full h-[1px]" />
    <div className="flex flex-col items-start gap-2 mt-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-[500px]" />
      </div>
      <Skeleton className="h-8 w-40" />
    </div>
    <div className="flex flex-col items-start gap-2 mt-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-[500px]" />
      </div>
      <Skeleton className="h-8 w-40" />
    </div>
    <Skeleton className="mt-8 w-40 h-6" />
    <Skeleton className="mt-2 w-full h-[1px]" />
    <div className="flex flex-col items-start gap-2 mt-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-[500px]" />
      </div>
      <Skeleton className="h-8 w-40" />
    </div>
    <div className="flex flex-col items-start gap-2 mt-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-[500px]" />
      </div>
      <Skeleton className="h-8 w-40" />
    </div>
  </Transition>
);
