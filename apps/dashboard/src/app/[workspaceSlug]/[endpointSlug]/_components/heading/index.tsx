import {IconPicker, Label} from '@/components';
import type {schema} from '@/lib/db';

interface HeadingProps {
  endpoint: schema.Endpoint;
}

export const Heading = ({endpoint}: HeadingProps) => {
  if (!endpoint) {
    return <></>;
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
