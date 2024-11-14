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
  DropdownMenuTrigger,
  Skeleton
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
  const {data, isLoading} = api.user.get.useQuery({id: props.userId});

  if (isLoading) {
    return (
      <div className="animate-fade-in flex gap-2 m-4">
        <Skeleton className="px-4 size-8" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-40 mr-2 h-4" />
          <Skeleton className="w-24 mr-2 h-2" />
        </div>
      </div>
    );
  }

  if (!data) {
    return;
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-12">
                <div className="flex flex-row items-center px-4 justify-center size-8 rounded-md bg-neutral-600 dark:bg-neutral-400">
                  <span className="fixed text-lg text-neutral-50 dark:text-neutral-950 font-semibold">
                    {data.name.split('')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col max-w-48">
                  <span className="text-sm font-regular truncate mr-2">
                    {data.name}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate">
                    {data.slug}
                  </span>
                </div>
                <ChevronUpDownIcon className="w-8 h-8" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
              <DropdownMenuLabel className="flex flex-row gap-2">
                <div className="flex select-none items-center justify-center size-10 rounded-md bg-neutral-600 dark:bg-neutral-400">
                  <span className="fixed text-lg text-neutral-50 dark:text-neutral-950 font-semibold">
                    {data.name.split('')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-regular max-w-[15rem] truncate mr-2">
                    {data.name}
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-regular max-w-[12.5rem] truncate mt-0.5">
                    {data.slug}
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