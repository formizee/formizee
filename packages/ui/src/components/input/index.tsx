import * as React from 'react';
import type {VariantProps} from 'class-variance-authority';
import { cva} from 'class-variance-authority';
import {cn} from '@/lib/ui';

const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-neutral-200 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default: 'bg-neutral-950',
        transparent: 'bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, variant, type, ...props}, ref) => {
    return (
      <input
        className={cn(inputVariants({variant, className}))}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export {Input};
