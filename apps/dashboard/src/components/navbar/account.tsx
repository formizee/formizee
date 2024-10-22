'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@formizee/ui';
import {
  HomeIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
  UserIcon
} from '@formizee/ui/icons';
import {useTheme} from 'next-themes';
import {logout} from './actions';
import Link from 'next/link';
import {api} from '@/trpc/client';

interface AccountButtonProps {
  userId: string;
}

export const AccountButton = (props: AccountButtonProps) => {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const user = api.user.get.useQuery({id: props.userId}).data;

  if (!user) {
    return;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={8}>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex flex-row items-center justify-start p-2 w-full h-12"
          >
            <div className="flex items-center justify-center size-8 rounded-md bg-neutral-600 dark:bg-neutral-400">
              <span className="fixed text-neutral-50 dark:text-neutral-950 font-bold">
                {user.name.split('')[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col items-start ml-1 flex-1">
              <span className="text-sm max-w-[12.5rem] truncate">
                {user.name}
              </span>
              <span className="text-xs max-w-48 truncate text-neutral-600 dark:text-neutral-400">
                {user.slug}
              </span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex justify-between">
          <Link
            href="https://formizee.com"
            className="flex flex-row items-center gap-2"
          >
            Homepage
            <HomeIcon />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={toggleTheme}
          className="flex justify-between"
        >
          Toggle Theme
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => logout()}
          className="flex justify-between"
        >
          Logout
          <LogoutIcon className="fill-red-500 dark:fill-red-400" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
