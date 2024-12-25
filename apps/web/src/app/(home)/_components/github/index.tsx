import type {CSSProperties} from 'react';
import {cn} from '@formizee/ui';

export function GithubLabel() {
  return (
    <a
      href="https://github.com/formizee/formizee"
      target="_blank"
      rel="noreferrer"
    >
      <span
        style={
          {
            '--shiny-width': '100px'
          } as CSSProperties
        }
        className={cn(
          'mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70',

          // Shine effect
          'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',

          // Shine gradient
          'bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80',

          'text-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-6 py-1 font-secondary hover:border-neutral-300 hover:dark:border-neutral-700 hover:bg-neutral-200 hover:dark:bg-neutral-800 transition-colors'
        )}
      >
        Star Us On Github
      </span>
    </a>
  );
}
