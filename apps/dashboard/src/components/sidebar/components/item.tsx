'use client';

import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';
import type {Color} from '@/lib/colors';
import {Icon} from '@/components/icon';
import {Skeleton} from '@formizee/ui';
import {motion} from 'motion/react';
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
      <motion.div
        initial={{translateY: -5, opacity: 0}}
        animate={{translateY: 0, opacity: 1}}
        exit={{translateY: 30, rotateZ: 15, opacity: 0}}
      >
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
      </motion.div>
    </SidebarMenuItem>
  );
};

export const EndpointSkeleton = () => (
  <SidebarMenuItem className="rounded-md h-8 flex gap-2 px-2 items-center">
    <Skeleton className="size-4 rounded-md" />
    <Skeleton className="h-4 w-[80%]" />
  </SidebarMenuItem>
);
