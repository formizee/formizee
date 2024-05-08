import {
  ChatIcon,
  HomeIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon
} from '@/components/ui/icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui';
import Link from 'next/link';

interface SidebarAccountProps {
  username: string;
}

export const SidebarAccount = (props: SidebarAccountProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="m-3 w-full">
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
          <DropdownMenuItem className="text-red-300 hover:text-red-500">
            <LogoutIcon />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SidebarAccount;
