'use client';

import {useCommandPalette} from '@/components/command-palette';
import {SearchIcon} from '@formizee/ui/icons';
import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';

export const Search = () => {
  const {setOpen} = useCommandPalette();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setOpen(open => !open)}
        className="text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <SearchIcon />
        <span>Search</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
