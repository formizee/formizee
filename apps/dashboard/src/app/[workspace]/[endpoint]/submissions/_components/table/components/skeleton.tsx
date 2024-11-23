import {Transition} from '@/components';
import {Skeleton} from '@formizee/ui';

export const LoadingSkeleton = () => (
  <Transition className="w-full h-full mt-4">
    <div className="flex gap-4">
      <Skeleton className="w-96 h-10" />
      <Skeleton className="w-32 h-10" />
      <Skeleton className="w-36 h-10" />
    </div>
    <Skeleton className="w-full h-96 mt-4" />
  </Transition>
);
