import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../lib/ui';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-x-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'font-secondary font-semibold shadow border-2 text-neutral-50 dark:text-neutral-950 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100',
        destructive:
          'font-secondary border-2 border-red-300 dark:border-red-700 bg-red-500 font-semibold text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-600 dark:text-neutral-50 dark:hover:bg-red-500',
        outline:
          'font-secondary border-2 border-neutral-200 bg-white font-semibold shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'font-secondary bg-neutral-100 font-semibold text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'font-secondary text-neutral-950 dark:text-neutral-300 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'font-regular text-amber-700 dark:text-amber-500'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export {Button, buttonVariants};
