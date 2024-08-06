'use client';
import {
  ChatIcon,
  HomeIcon,
  LinkIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon
} from '@formizee/ui/icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '@formizee/ui';
import Link from 'next/link';
import {logout} from './actions';

export const Navbar = () => {
  return (
    <nav className="flex flex-row justify-end bg-neutral-950/50 backdrop-blur-md top right-0 fixed p-4 gap-2 rounded-bl-md">
      <Button variant="ghost">
        <Link
          href="https://docs.formizee.com"
          target="_blank"
          className="flex flex-row items-center gap-2"
        >
          Docs
          <LinkIcon />
        </Link>
      </Button>
      <Button variant="outline">
        <ChatIcon />
        Feedback
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <UserIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={6}
          className="w-36"
        >
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex flex-row items-center gap-2">
              <SettingsIcon className="fill-neutral-400" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ChatIcon className="fill-neutral-400" />
            Feedback
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="https://formizee.com"
              className="flex flex-row items-center gap-2"
            >
              <HomeIcon className="fill-neutral-400" />
              Homepage
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={async () => logout()}>
            <LogoutIcon className="fill-red-400" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
