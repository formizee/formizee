import {cn} from '@formizee/ui';
import type {Example, Stack} from './types';

interface SidebarProps {
  current: Example | undefined;
  stack: Stack | undefined;
  examples: Example[];
  setExample: React.Dispatch<React.SetStateAction<Example | undefined>>;
}

export const Sidebar = ({
  stack,
  current,
  examples,
  setExample
}: SidebarProps) => {
  return (
    <nav className="flex flex-row py-1 min-h-12 overflow-x-scroll overflow-y-hidden sm:overflow-visible w-full pt-1 pb-4 sm:flex-col sm:min-w-32 sm:max-w-56 pl-1 sm:pr-8 sm:justify-start gap-2">
      {examples.map(example => {
        const selected = example.name === current?.name;

        if (example.stack === stack?.stack) {
          return (
            <button
              key={example.name}
              type="button"
              className={cn(
                selected
                  ? 'border dark:border-neutral-800'
                  : 'border border-transparent text-neutral-400 dark:text-neutral-600',
                'rounded-md px-2 py-1 min-h-8 text-nowrap sm:w-full flex flex-row gap-2 items-center text-sm'
              )}
              onClick={() => setExample(example)}
            >
              <example.icon />
              {example.name}
            </button>
          );
        }
      })}
    </nav>
  );
};
