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
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </Button>
        <Button variant="outline">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M1 8.74c0 .983.713 1.825 1.69 1.943.764.092 1.534.164 2.31.216v2.351a.75.75 0 0 0 1.28.53l2.51-2.51c.182-.181.427-.286.684-.294a44.298 44.298 0 0 0 3.837-.293C14.287 10.565 15 9.723 15 8.74V4.26c0-.983-.713-1.825-1.69-1.943a44.447 44.447 0 0 0-10.62 0C1.712 2.435 1 3.277 1 4.26v4.482ZM5.5 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm2.5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3.5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Feedback</span>
        </Button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
