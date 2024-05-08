import {ChatIcon, LinkIcon} from '@/components/ui/icons';
import {Button} from '@/components/ui';
import {Logo} from '@/components';
import Link from 'next/link';

export const DashboardNavbar = () => {
  return (
    <nav className="top-0 flex h-14 w-full items-center justify-between border-b border-b-neutral-800 px-4 py-6">
      <Logo />
      <div className="flex flex-row gap-x-1">
        <Button variant="ghost" asChild>
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
    </nav>
  );
};

export default DashboardNavbar;
