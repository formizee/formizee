'use client';

import Link from 'next/link';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Logo
} from '@formizee/ui';
import {ChatIcon, DocumentIcon, LinkIcon, MenuIcon} from '@formizee/ui/icons';

export function DashboardNavbar(): JSX.Element {
  return (
    <nav className="top-0 flex h-14 w-full items-center justify-between border-b border-b-neutral-800 px-4 py-8">
      <Logo />
      <div className="hidden flex-row gap-x-1 md:flex">
        <Button asChild variant="ghost">
          <Link href="/docs">
            <span>Docs</span>
            <LinkIcon />
          </Link>
        </Button>
        <Button variant="outline">
          <ChatIcon />
          <span>Feedback</span>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full md:hidden">
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <DocumentIcon />
            <span>Docs</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ChatIcon />
            <span>Feedback</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default DashboardNavbar;
