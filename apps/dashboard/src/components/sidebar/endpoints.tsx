'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '@formizee/ui/sidebar';
import {api} from '@/trpc/client';
import {EndpointItem, EndpointSkeleton} from './item';
import Transition from '../transition';
import {CreateButton} from './create';

interface Props {
  workspaceSlug: string;
}

export const EndpointsContent = (props: Props) => {
  const {data, isLoading} = api.endpoint.list.useQuery({
    workspaceSlug: props.workspaceSlug
  });

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarGroupLabel className="text-neutral-600 dark:text-neutral-300">
            Forms
          </SidebarGroupLabel>
          <SidebarMenu>
            <Transition>
              {Array.from({length: 5}).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <EndpointSkeleton key={index} />
              ))}
            </Transition>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const endpoints = data ?? [];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-neutral-600 dark:text-neutral-300">
        Forms
      </SidebarGroupLabel>
      <CreateButton workspaceSlug={props.workspaceSlug} />
      <SidebarGroupContent>
        <SidebarMenu>
          {endpoints.map(endpoint => (
            <EndpointItem
              href={`/${props.workspaceSlug}/${endpoint.slug}`}
              color={endpoint.color}
              icon={endpoint.icon}
              key={endpoint.id}
              selected={false}
            >
              {endpoint.name}
            </EndpointItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
