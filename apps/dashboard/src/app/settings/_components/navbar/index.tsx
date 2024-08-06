import {NavbarOptions} from '@/components';
import {Logo} from '@formizee/ui';

export const SettingsNavbar = () => {
  return (
    <nav className="z-50 border-b border-b-neutral-200 dark:border-b-neutral-800 bg-neutral-50/[.01] dark:bg-neutral-950/[0.01] flex flex-row justify-between w-full backdrop-blur-lg fixed">
      <div className="flex flex-row items-center pl-4 gap-3">
        <Logo />
        <span className="px-3 border select-none border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-100">
          Beta
        </span>
      </div>
      <NavbarOptions />
    </nav>
  );
};

export default SettingsNavbar;
