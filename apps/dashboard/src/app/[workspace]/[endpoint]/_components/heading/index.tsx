'use client';

import {IconPicker, Badge} from '@/components';
import type {schema} from '@/lib/db';

interface HeadingProps {
  endpoint: schema.Endpoint;
}

export const Heading = ({endpoint}: HeadingProps) => {
  return (
    <div className="flex flex-row gap-4 mb-6 items-center">
      <IconPicker endpoint={endpoint} />
      <h1 className="font-bold text-4xl">{endpoint.name}</h1>
      <Badge className="mt-1" variant={endpoint.isEnabled ? 'green' : 'yellow'}>
        {endpoint.isEnabled ? 'Active' : 'Paused'}
      </Badge>
    </div>
  );
};

export default Heading;
