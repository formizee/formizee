import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../lib/ui';

const logoVariants = cva(
  'select-none bg-gradient-to-b from-neutral-600 to-neutral-950 dark:from-neutral-50 dark:to-neutral-500 bg-clip-text text-2xl font-semibold sm:font-bold text-transparent no-underline',
  {
    variants: {
      size: {
        default: 'text-2xl',
        sm: 'text-xl',
        lg: 'text-4xl',
        xl: 'text-6xl'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export interface LogoProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof logoVariants> {
  asChild?: boolean;
}

const Logo = React.forwardRef<HTMLHeadingElement, LogoProps>(
  ({className, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'span';
    return (
      <Comp
        className={cn(logoVariants({size, className}))}
        ref={ref}
        {...props}
      >
        Formizee.
      </Comp>
    );
  }
);
Logo.displayName = 'Logo';

export {Logo, logoVariants};
