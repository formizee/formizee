'use client';

import {Button, Logo, cn} from '@formizee/ui';
import Link from 'next/link';

interface NavbarProps {
  className?: string;
}

const items = [
  {
    name: 'About',
    href: '/about'
  },
  {
    name: 'Pricing',
    href: '/pricing'
  },
  {
    name: 'Blog',
    href: '/blog'
  },
  {
    name: 'Docs',
    href: 'https://docs.formizee.com'
  }
];

export function Navbar(props: NavbarProps): JSX.Element {
  return (
    <nav
      className={cn(
        props.className,
        'fixed top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 flex h-16 w-full items-center justify-between border-b px-4'
      )}
    >
      <Link href="/">
        <Logo />
      </Link>
      <ul className="flex flex-row gap-8">
        {items.map(({name, href}) => (
          <li
            key={href}
            className="transition-colors text-sm font-medium font-secondary text-neutral-700 hover:text-neutral-950 underline-offset-4 hover:underline"
          >
            <Link href={href}>{name}</Link>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className="max-w-32 font-secondary border-2 hover:border-neutral-500 border-neutral-700 bg-neutral-900"
      >
        <Link href="https://dashboard.formizee.com">Dashboard</Link>
      </Button>
    </nav>
  );
}

export default Navbar;
