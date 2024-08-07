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
  ChatIcon,
  HomeIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon
} from '@formizee/ui/icons';
import Link from 'next/link';
import {logout} from '../../actions';

interface SidebarAccountProps {
  username: string;
}

export function SidebarAccount(props: SidebarAccountProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="m-3 w-full" variant="outline">
            <UserIcon />
            <span>{props.username}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem>
            <ChatIcon />
            <span>Feedback</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">
              <HomeIcon />
              <span>Homepage</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-300 hover:text-red-500"
            onSelect={async () => logout()}
          >
            <LogoutIcon />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SidebarAccount;
