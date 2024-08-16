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
  SettingsIcon,
  SunIcon,
  UserIcon
} from '@formizee/ui/icons';
import {useTheme} from 'next-themes';
import {logout} from './actions';
import Link from 'next/link';

export const AccountButton = () => {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-[10.5rem]"
      >
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex flex-row items-center gap-2">
            <SettingsIcon />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://formizee.com"
            className="flex flex-row items-center gap-2"
          >
            <HomeIcon />
            Homepage
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          Toggle Theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={async () => logout()}>
          <LogoutIcon className="fill-red-500 dark:fill-red-400" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
