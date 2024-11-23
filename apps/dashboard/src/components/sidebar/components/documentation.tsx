import {BookIcon} from '@formizee/ui/icons';
import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';

export const Documentation = () => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
    >
      <a
        target="_blank"
        rel="noreferrer"
        href="https://docs.formizee.com"
        className="text-neutral-600 dark:text-neutral-400"
      >
        <BookIcon />
        <span>Documentation</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
