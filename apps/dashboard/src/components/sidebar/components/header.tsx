import {SidebarHeader} from '@formizee/ui/sidebar';
import {Logo} from '@formizee/ui';

export const Header = () => (
  <SidebarHeader>
    <div className="flex flex-row items-center h-14 pl-2 gap-5">
      <Logo />
      <span className="px-3 border select-none border-neutral-300 dark:border-neutral-700 rounded-xl text-sm tex-neutral-700 dark:text-neutral-100">
        Beta
      </span>
    </div>
  </SidebarHeader>
);
