'use client';

import {api} from '@/trpc/client';
import Item from './item';

interface EndpointsProps {
  workspaceSlug: string;
  endpointSlug: string;
}

export const Endpoints = (props: EndpointsProps) => {
  const {data} = api.endpoint.list.useQuery({
    workspaceSlug: props.workspaceSlug
  });

  const endpoints = data ?? [];

  return (
    <div className="flex flex-1 pr-2 flex-col my-2 gap-2 overflow-y-auto overflow-light-style dark:overflow-dark-style">
      {endpoints.map(endpoint => (
        <Item
          key={endpoint.slug}
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
