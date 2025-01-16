'use client';

import {SidebarHeader} from '@formizee/ui/sidebar';
import {useTheme} from 'next-themes';
import {cn, Logo} from '@formizee/ui';
import {api} from '@/trpc/client';

interface SidebarHeaderProps {
  workspaceSlug: string;
}

export const ShinyBadge = () => {
  const {resolvedTheme} = useTheme();
  const borderRadius = 22;
  const borderWidth = 1;
  const duration = 28;

  const color =
    resolvedTheme === 'dark'
      ? [
          '#262626',
          '#262626',
          '#A07CFE',
          '#FE8FB5',
          '#FFBE7B',
          '#262626',
          '#262626'
        ]
      : [
          '#e5e5e5',
          '#e5e5e5',
          '#A07CFE',
          '#FE8FB5',
          '#FFBE7B',
          '#e5e5e5',
          '#e5e5e5'
        ];

  return (
    <div
      style={
        {
          '--border-radius': `${borderRadius}px`
        } as React.CSSProperties
      }
      className={cn(
        'relative w-fit place-items-center rounded-[--border-radius] bg-white text-black dark:bg-black dark:text-white',
        'relative flex h-[22px] w-[48px] items-center gap-2 font-secondary px-3 py-0.5 select-none border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-100'
      )}
    >
      <div
        style={
          {
            '--border-width': `${borderWidth}px`,
            '--border-radius': `${borderRadius}px`,
            '--duration': `${duration}s`,
            '--mask-linear-gradient':
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            '--background-radial-gradient': `radial-gradient(${Array.isArray(color) ? color.join(',') : color})`
          } as React.CSSProperties
        }
        className={`pointer-events-none before:bg-shine-size before:absolute before:inset-0 before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine`}
      />
      <span className="absolute right-[13px]">Pro</span>
    </div>
  );
};

export const Header = ({workspaceSlug}: SidebarHeaderProps) => {
  const workspace = api.workspace.get.useQuery({slug: workspaceSlug});
  const isPro = workspace.data?.plan === 'pro';

  return (
    <SidebarHeader>
      <div className="flex flex-row items-center h-14 pl-2 gap-5">
        <Logo />
        {!workspace.isLoading && isPro ? (
          <ShinyBadge />
        ) : (
          <span className="flex items-center gap-2 font-secondary px-3 py-0.5 border select-none border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-100">
            Beta
          </span>
        )}
      </div>
    </SidebarHeader>
  );
};
