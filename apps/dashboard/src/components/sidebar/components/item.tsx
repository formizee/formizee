'use client';

import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';
import type {Color} from '@/lib/colors';
import {Icon} from '@/components/icon';
import {Skeleton} from '@formizee/ui';
import Link from 'next/link';

interface EndpointItemProps {
  children: React.ReactNode;
  selected: boolean;
  color: Color;
  icon: string;
  href: string;
}

export const EndpointItem = (props: EndpointItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <Link href={props.href}>
          <Icon
            icon={props.icon}
            color={props.color}
            selected={props.selected}
          />
          <span>{props.children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const EndpointSkeleton = () => (
  <SidebarMenuItem className="rounded-md h-8 flex gap-2 px-2 items-center">
    <Skeleton className="size-4 rounded-md" />
    <Skeleton className="h-4 w-[80%]" />
  </SidebarMenuItem>
);
