'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {CheckIcon} from '../../icons';
import {cn} from '../../lib/ui';

export const getColor = (color: string | undefined) => {
  switch (color) {
    case 'violet':
      return 'data-[state=checked]:border-violet-600 dark:data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-600 dark:data-[state=checked]:bg-violet-500';
    case 'indigo':
      return 'data-[state=checked]:border-indigo-600 dark:data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600 dark:data-[state=checked]:bg-indigo-500';
    case 'cyan':
      return 'data-[state=checked]:border-cyan-600 dark:data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-600 dark:data-[state=checked]:bg-cyan-500';
    case 'pink':
      return 'data-[state=checked]:border-pink-600 dark:data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-600 dark:data-[state=checked]:bg-pink-500';
    case 'amber':
      return 'data-[state=checked]:border-amber-600 dark:data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-600 dark:data-[state=checked]:bg-amber-500';
    case 'teal':
      return 'data-[state=checked]:border-teal-600 dark:data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-500';
    case 'lime':
      return 'data-[state=checked]:border-lime-600 dark:data-[state=checked]:border-lime-500 data-[state=checked]:bg-lime-600 dark:data-[state=checked]:bg-lime-500';
    case 'red':
      return 'data-[state=checked]:border-red-600 dark:data-[state=checked]:border-red-500 data-[state=checked]:bg-red-600 dark:data-[state=checked]:bg-red-500';
    default:
      return 'data-[state=checked]:bg-neutral-950 dark:data-[state=checked]:bg-neutral-50';
  }
};

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, color, ...props}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-accent-color="red"
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-neutral-200 border-neutral-900 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-neutral-50 dark:border-neutral-800 dark:border-neutral-50 dark:focus-visible:ring-neutral-300 dark:data-[state=checked]:text-neutral-900',
      getColor(color),
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};
