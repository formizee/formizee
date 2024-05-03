import {Button} from '../ui';
import Logo from './logo';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full flex items-center justify-between px-4 h-14">
      <Logo />
      <Button variant="outline">Login</Button>
    </nav>
  );
};

export default Navbar;
