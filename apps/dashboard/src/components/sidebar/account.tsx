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
import {
  BookIcon,
  ChevronUpDownIcon,
  HomeIcon,
  LogoutIcon,
  SettingsIcon
} from '@formizee/ui/icons';
import {ThemeToggle} from '../theme';
import Link from 'next/link';
import {logout} from './actions';

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
              <SidebarMenuButton className="h-10 mb-2">
                <div className="flex items-center justify-center size-8 rounded-md bg-neutral-600 dark:bg-neutral-400">
                  <span className="fixed text-lg text-neutral-50 dark:text-neutral-950 font-semibold">
                    {user.name.split('')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-regular max-w-[9rem] truncate mr-2">
                    {user.name}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate">
                    {user.slug}
                  </span>
                </div>
                <ChevronUpDownIcon className="w-8 h-8" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
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
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate mt-0.5">
                    Free Plan
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  target="_blank"
                  href="https://docs.formizee.com"
                  className="flex flex-row items-center gap-2"
                >
                  <BookIcon variant="outline" />
                  <span>Documentation</span>
                </Link>
              </DropdownMenuItem>
              <ThemeToggle />
              <DropdownMenuItem>
                <Link
                  href="https://formizee.com"
                  className="flex flex-row items-center gap-2"
                >
                  <HomeIcon variant="outline" />
                  Homepage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon variant="outline" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => logout()}>
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
