'use client';

import {MoonIcon, SunIcon, ToolsIcon} from '@formizee/ui/icons';
import {cn, Skeleton} from '@formizee/ui';
import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';

interface Props {
  className?: string;
}

export const ThemeToggle = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton
        className={cn('rounded-full w-[5.2rem] h-[1.6rem]', props.className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'animate-fade-in flex flex-row gap-1 items-center justify-between rounded-full border dark:border-neutral-800 w-[5.2rem] h-[1.6rem]',
        props.className
      )}
    >
      <button
        onClick={() => setTheme('system')}
        type="button"
        className={
          theme === 'system'
            ? '-ml-[2px] p-1 rounded-full bg-white dark:bg-black border dark:border-neutral-800 rounded-full'
            : 'p-1 text-neutral-400 dark:text-neutral-600'
        }
      >
        <ToolsIcon className="p-[0.15rem]" />
      </button>
      <button
        onClick={() => setTheme('light')}
        type="button"
        className={
          theme === 'light'
            ? 'p-1 rounded-full bg-white dark:bg-black border dark:border-neutral-800 rounded-full'
            : 'p-1 text-neutral-400 dark:text-neutral-600'
        }
      >
        <SunIcon />
      </button>
      <button
        onClick={() => setTheme('dark')}
        type="button"
        className={
          theme === 'dark'
            ? '-mr-[2px] p-1 rounded-full bg-white dark:bg-black border dark:border-neutral-800 rounded-full'
            : 'p-1 text-neutral-400 dark:text-neutral-600'
        }
      >
        <MoonIcon />
      </button>
    </div>
  );
};
