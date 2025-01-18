import * as React from 'react';
import {cn} from '../../lib/ui';
import {SearchIcon} from '../../icons';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    if (type === 'search') {
      return (
        <div className="w-full relative">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <SearchIcon className="text-neutral-foreground" />
          </div>
          <input
            autoComplete="off"
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent py-2 px-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-foreground focus-visible:outline-none ring-neutral-300 dark:ring-neutral-700 focus-visible:ring-1 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border-2 border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-foreground focus-visible:outline-none ring-neutral-300 dark:ring-neutral-700 focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export {Input};
