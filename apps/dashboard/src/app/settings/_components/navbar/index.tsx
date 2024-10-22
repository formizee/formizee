import {Options} from '@/components/navbar';
import {Logo} from '@formizee/ui';

interface SettingsNavbarProps {
  userId: string;
}

export const SettingsNavbar = (props: SettingsNavbarProps) => {
  return (
    <nav className="z-50 dark:border-b-neutral-800 bg-neutral-50/[.01] dark:bg-neutral-950/[0.01] flex flex-row justify-between w-full backdrop-blur-lg pr-[1px] fixed">
      <div className="flex flex-row pt-1 items-center pl-4 gap-5">
        <Logo />
        <span className="px-3 border select-none border-neutral-300 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-100">
          Beta
        </span>
      </div>
      <Options {...props} />
    </nav>
  );
};

export default SettingsNavbar;
