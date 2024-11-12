'use client';

import {api} from '@/trpc/client';

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@formizee/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@formizee/ui';
import {LogoutIcon, SettingsIcon} from '@formizee/ui/icons';
import {ThemeToggle} from '../theme';

interface AccountProps {
  userId: string;
}

export const Account = (props: AccountProps) => {
  const user = api.user.get.useQuery({id: props.userId}).data;

  if (!user) {
    return;
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-10">
                <div className="flex items-center justify-center size-6 rounded-[5px] bg-neutral-600 dark:bg-neutral-400">
                  <span className="fixed text-neutral-50 dark:text-neutral-950 font-bold">
                    {user.name.split('')[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm max-w-[12.5rem] truncate">
                  {user.name}
                </span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              <DropdownMenuLabel className="flex flex-row gap-2">
                <div className="flex items-center justify-center size-10 rounded-md bg-neutral-600 dark:bg-neutral-400">
                  <span className="fixed text-lg text-neutral-50 dark:text-neutral-950 font-semibold">
                    {user.name.split('')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-regular max-w-[15rem] truncate mr-2">
                    {user.name}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate">
                    {user.slug}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ThemeToggle />
              <DropdownMenuItem>
                <SettingsIcon variant="outline" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogoutIcon />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
