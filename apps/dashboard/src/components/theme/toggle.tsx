'use client';

import {ToolsIcon, MoonIcon, SunIcon} from '@formizee/ui/icons';
import {DropdownMenuItem} from '@formizee/ui';
import {useTheme} from 'next-themes';

export const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  const getLabel = () => {
    switch (theme) {
      case 'system': {
        return 'System Theme';
      }
      case 'dark': {
        return 'Dark Theme';
      }
      case 'light': {
        return 'Light Theme';
      }
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'system': {
        return <ToolsIcon />;
      }
      case 'dark': {
        return <MoonIcon />;
      }
      case 'light': {
        return <SunIcon />;
      }
    }
  };
  const onClick = () => {
    switch (theme) {
      case 'system': {
        setTheme('dark');
        break;
      }
      case 'dark': {
        setTheme('light');
        break;
      }
      case 'light': {
        setTheme('system');
        break;
      }
    }
  };

  return (
    <DropdownMenuItem
      className="transition-colors text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      onClick={onClick}
    >
      {getIcon()}
      {getLabel()}
    </DropdownMenuItem>
  );
};
