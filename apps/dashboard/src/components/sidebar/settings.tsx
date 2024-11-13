import {SettingsIcon} from '@formizee/ui/icons';
import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';

export const Settings = () => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
    >
      <a href="/settings" className="text-neutral-600 dark:text-neutral-400">
        <SettingsIcon />
        <span>Settings</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
