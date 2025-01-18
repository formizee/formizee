'use client';

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@formizee/ui/sidebar';
import type {Color} from '@/lib/colors';
import {Icon} from '@/components/icon';
import {Skeleton} from '@formizee/ui';
import {motion} from 'motion/react';
import {useRouter} from 'next/navigation';

interface EndpointItemProps {
  children: React.ReactNode;
  selected: boolean;
  color: Color;
  icon: string;
  href: string;
}

export const EndpointItem = (props: EndpointItemProps) => {
  const {setOpenMobile} = useSidebar();
  const router = useRouter();

  const onClick = () => {
    router.push(props.href);
    setOpenMobile(false);
  };

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
          <button type="button" onClick={onClick}>
            <Icon
              icon={props.icon}
              color={props.color}
              selected={props.selected}
            />
            <span>{props.children}</span>
          </button>
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
