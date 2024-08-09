import {api} from '@/trpc/server';
import Item from './item';
import {handleTrpcServerAction} from '@/trpc/utils';

interface EndpointsProps {
  workspaceSlug: string;
  endpointSlug: string;
}

export const Endpoints = async (props: EndpointsProps) => {
  const endpoints = await handleTrpcServerAction(
    api.endpoint.list.query({workspaceSlug: props.workspaceSlug})
  );

  return (
    <div className="flex flex-1 flex-col bg-red my-2 gap-2">
      {endpoints.map(endpoint => (
        <Item
          key={endpoint.id}
          icon={endpoint.icon}
          slug={endpoint.slug}
          color={endpoint.color}
          workspaceSlug={props.workspaceSlug}
          selected={endpoint.slug === props.endpointSlug}
        >
          {endpoint.name}
        </Item>
      ))}
    </div>
  );
};
