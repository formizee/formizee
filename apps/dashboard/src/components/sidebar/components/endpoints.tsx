'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '@formizee/ui/sidebar';
import {api} from '@/trpc/client';
import {EndpointItem, EndpointSkeleton} from './item';
import {AnimatePresence, motion} from 'motion/react';
import {Create} from './create';

interface Props {
  workspaceSlug: string;
}

export const Endpoints = (props: Props) => {
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
            <AnimatePresence>
              {Array.from({length: 5}).map((_, index) => (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  initial={{translateY: -5, opacity: 0}}
                  animate={{translateY: 0, opacity: 1}}
                  exit={{translateY: 30, rotateZ: 15, opacity: 0}}
                >
                  <EndpointSkeleton />
                </motion.div>
              ))}
            </AnimatePresence>
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
      <Create workspaceSlug={props.workspaceSlug} />
      <SidebarGroupContent>
        <SidebarMenu>
          <AnimatePresence>
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
          </AnimatePresence>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
