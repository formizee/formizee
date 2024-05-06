import {Button} from '../ui';
import Link from 'next/link';
import Logo from './logo';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-4 h-14">
      <Logo />
      <Button variant="outline" asChild>
        <Link href="/login">Login</Link>
      </Button>
    </nav>
  );
};

export default Navbar;
