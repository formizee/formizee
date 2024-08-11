import {NavbarOptions} from '@/components';

export const Navbar = () => {
  return (
    <nav className="z-50 flex flex-row bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md right-4 fixed rounded-bl-md">
      <NavbarOptions />
    </nav>
  );
};
