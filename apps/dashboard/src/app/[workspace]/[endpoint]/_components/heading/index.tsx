'use client';

import {IconPicker, Badge} from '@/components';
import type {schema} from '@/lib/db';

interface HeadingProps {
  endpoint: schema.Endpoint;
}

export const Heading = ({endpoint}: HeadingProps) => {
  return (
    <div className="flex flex-row gap-4 mt-8 sm:mt-0 mb-2 items-center">
      <IconPicker endpoint={endpoint} />
      <h1 className="font-bold max-w-56 truncate text-2xl sm:max-w-96 sm:text-4xl">
        {endpoint.name}
      </h1>
      <Badge className="mt-1" variant={endpoint.isEnabled ? 'green' : 'yellow'}>
        {endpoint.isEnabled ? 'Active' : 'Paused'}
      </Badge>
    </div>
  );
};

export default Heading;
