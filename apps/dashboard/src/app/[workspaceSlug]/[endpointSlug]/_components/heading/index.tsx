'use client';

import {IconPicker, Label} from '@/components';
import {Skeleton} from '@formizee/ui';
import type {schema} from '@/lib/db';

interface HeadingProps {
  endpoint: schema.Endpoint | null;
}

export const Heading = ({endpoint}: HeadingProps) => {
  if (!endpoint) {
    return (
      <div className="animate-fade-in flex flex-row gap-4 mb-6 items-center">
        <Skeleton className="size-12" />
        <Skeleton className="h-12 w-[24rem]" />
        <Skeleton className="rounded-xl h-6 w-20 px-3" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-row gap-4 mb-6 items-center">
      <IconPicker endpoint={endpoint} />
      <h1 className="font-bold text-4xl">{endpoint.name}</h1>
      <Label
        className="mt-1"
        variant={endpoint.isEnabled ? 'active' : 'paused'}
      >
        {endpoint.isEnabled ? 'Active' : 'Paused'}
      </Label>
    </div>
  );
};

export default Heading;
