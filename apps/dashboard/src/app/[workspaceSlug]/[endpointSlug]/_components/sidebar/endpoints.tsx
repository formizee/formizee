import {api} from '@/trpc/server';
import Item from './item';

interface EndpointsProps {
  workspaceSlug: string;
  endpointSlug: string;
}

export const Endpoints = (props: EndpointsProps) => {
  return (
    <div className="flex flex-1 flex-col bg-red my-2 gap-2">
      <Content
        workspaceSlug={props.workspaceSlug}
        endpointSlug={props.endpointSlug}
      />
    </div>
  );
};

const Content = async (props: EndpointsProps) => {
  const endpoints = await api.endpoint.list.query({
    workspaceSlug: props.workspaceSlug
  });

  if (!endpoints) {
    return <></>;
  }

  return endpoints.map(endpoint => (
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
  ));
};
