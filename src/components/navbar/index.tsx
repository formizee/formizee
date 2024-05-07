import {Button} from '../ui';
import Link from 'next/link';
import Logo from './logo';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between bg-black px-4">
      <Logo />
      <Button variant="outline" asChild>
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
