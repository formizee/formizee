'use client';

import {useEffect, useState} from 'react';
import {cn} from '@/lib/ui';

import {Button} from '../ui';
import Link from 'next/link';
import Logo from './logo';

export function Navbar() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
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
        'fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b px-4 transition-all duration-500',
        background
      )}>
      <Logo />
      <Button asChild variant="outline">
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
}

export default Navbar;
