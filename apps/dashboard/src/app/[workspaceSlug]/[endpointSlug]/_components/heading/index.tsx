import {IconPicker, Label} from '@/components';

interface HeadingProps {
  endpoint:
    | {
        name: string | null;
        isEnabled: boolean;
      }
    | undefined;
  params: {
    workspaceSlug: string;
    endpointSlug: string;
  };
}

export const Heading = ({params, endpoint}: HeadingProps) => {
  if (!endpoint) {
    return <></>;
  }

  return (
    <div className="animate-fade-in flex flex-row gap-4 mb-6 items-center">
      <IconPicker {...params} />
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
