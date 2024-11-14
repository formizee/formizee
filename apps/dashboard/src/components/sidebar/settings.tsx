'use client';

import {SettingsIcon} from '@formizee/ui/icons';

import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';
import {useSettings} from '../settings';

export function Settings() {
  const {setOpen} = useSettings();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setOpen(open => !open)}
        className="transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      >
        <SettingsIcon />
        <span>Settings</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
