'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Logo,
  cn
} from '@formizee/ui';
import {MenuIcon} from '@formizee/ui/icons';
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
  /*
  {
    name: 'Blog',
    href: '/blog'
  },
  */
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
        'fixed top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 flex h-16 w-full items-center justify-between border-b dark:border-neutral-800 px-4 animate-in slide-in-from-top-5 fade-in duration-1000'
      )}
    >
      <Link tabIndex={-1} href="/">
        <Logo />
      </Link>
      <ul className="hidden sm:flex flex-row gap-8">
        {items.map(({name, href}) => (
          <li
            key={href}
            className="transition-colors text-sm font-medium font-secondary text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 underline-offset-4 hover:underline"
          >
            <Link
              className="px-2 py-1 outline-black/70 dark:outline-white/70 rounded-2xl"
              href={href}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        asChild
        className="hidden sm:flex max-w-32 font-secondary border-2 hover:border-neutral-500 border-neutral-700 bg-neutral-900"
      >
        <Link href="https://dashboard.formizee.com">Dashboard</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            aria-label="Menu"
            className="flex sm:hidden border-2 hover:border-neutral-500 border-neutral-700 bg-neutral-900 dark:border-neutral-200"
          >
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={6}
          align="end"
          className="bg-neutral-900 border-[1.5px] border-neutral-500 dark:bg-neutral-50 dark:border-neutral-200"
        >
          {items.map(({name, href}) => (
            <DropdownMenuItem
              asChild
              key={name}
              className="font-secondary text-neutral-50 dark:text-neutral-950"
            >
              <Link href={href}>{name}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="h-[1.5px] bg-neutral-700 dark:bg-neutral-200" />
          <DropdownMenuItem
            asChild
            className="font-secondary text-neutral-50 dark:text-neutral-950"
          >
            <Link href="https://dashboard.formizee.com">Dashboard</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Navbar;
