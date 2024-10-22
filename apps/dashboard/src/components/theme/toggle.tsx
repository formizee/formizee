'use client';

import {SunIcon, MoonIcon} from '@formizee/ui/icons';
import {useTheme} from 'next-themes';
import {Button} from '@formizee/ui';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = (props: ThemeToggleProps) => {
  const {theme, setTheme} = useTheme();

  const onClick = () =>
    theme === 'light' ? setTheme('dark') : setTheme('light');

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={onClick}
      className={props.className}
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};
