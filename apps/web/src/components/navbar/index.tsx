'use client';

import {Button, Logo, cn} from '@formizee/ui';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

function NavbarLogo(): JSX.Element {
  const pathname = usePathname();

  if (pathname === '/') {
    return <Logo />;
  }

  return (
    <Link href="/">
      <Logo />
    </Link>
  );
}

interface NavbarProps {
  className?: string;
}

export function Navbar(props: NavbarProps): JSX.Element {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (): void => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

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
        props.className,
        'fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b px-4 transition-all duration-500',
        background
      )}
    >
      <NavbarLogo />
      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
}

export default Navbar;
