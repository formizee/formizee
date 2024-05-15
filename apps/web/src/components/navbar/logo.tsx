'use client';

import {Logo} from '@/components';
import {usePathname} from 'next/navigation';
import Link from 'next/link';

export function NavbarLogo() {
  const pathname = usePathname();

  if (pathname === '/') return <Logo />;

  return (
    <Link href="/">
      <Logo />
    </Link>
  );
}

export default NavbarLogo;
