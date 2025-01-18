'use client';

import {useSidebar} from '@formizee/ui/sidebar';
import {MenuIcon} from '@formizee/ui/icons';
import type {schema} from '@formizee/db';
import {Button} from '@formizee/ui';
import {Icon} from '../icon';

interface MobileNavbarProps {
  endpoint: schema.Endpoint;
}

export const MobileNavbar = ({endpoint}: MobileNavbarProps) => {
  const {openMobile, setOpenMobile} = useSidebar();

  return (
    <header className="fixed -mx-2 z-50 flex sm:!hidden top-0 w-full items-center gap-2 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b dark:border-neutral-800">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <MenuIcon className="text-neutral-600 dark:text-neutral-400" />
      </Button>
      <Icon color={endpoint.color} icon={endpoint.icon} selected />
      <span>{endpoint.name}</span>
    </header>
  );
};
