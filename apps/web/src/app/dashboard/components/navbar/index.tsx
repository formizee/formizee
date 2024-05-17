import Link from 'next/link';
import { Button, Logo } from '@formizee/ui';
import { ChatIcon, LinkIcon } from '@formizee/ui/icons';

export function DashboardNavbar(): JSX.Element {
  return (
    <nav className="top-0 flex h-14 w-full items-center justify-between border-b border-b-neutral-800 px-4 py-6">
      <Logo />
      <div className="flex flex-row gap-x-1">
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
    </nav>
  );
}

export default DashboardNavbar;
