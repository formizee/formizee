'use client';

import {trpc} from '@/trpc/client';
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

const Content = (props: EndpointsProps) => {
  const data = trpc.endpoint.list.useQuery({
    workspaceSlug: props.workspaceSlug
  }).data;

  if (!data?.endpoints) {
    return <></>;
  }

  return data.endpoints.map(endpoint => (
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
