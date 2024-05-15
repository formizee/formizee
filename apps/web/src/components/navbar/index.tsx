'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/ui';
import { Button, Logo } from '../ui';

function NavbarLogo(): JSX.Element {
  const pathname = usePathname();

  if (pathname === '/') return <Logo />;

  return (
    <Link href="/">
      <Logo />
    </Link>
  );
}

export function Navbar(): JSX.Element {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (): void => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const background =
    scrollPosition > 10
      ? 'bg-black/70 border-b-neutral-800 backdrop-blur-md'
      : 'bg-transparent border-b-transparent backdrop-blur-none';

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b px-4 transition-all duration-500',
        background
      )}>
      <NavbarLogo />
      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
}

export default Navbar;
