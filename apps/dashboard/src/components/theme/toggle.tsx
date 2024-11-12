'use client';

import {SunIcon, MoonIcon} from '@formizee/ui/icons';
import {DropdownMenuItem} from '@formizee/ui';
import {useTheme} from 'next-themes';

export const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  const onClick = () =>
    theme === 'light' ? setTheme('dark') : setTheme('light');

  return (
    <DropdownMenuItem
      className="transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
      onClick={onClick}
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
      Toggle Theme
    </DropdownMenuItem>
  );
};
