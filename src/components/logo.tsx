import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/ui';

const logoVariants = cva(
  'no-underline text-transparent select-none bg-clip-text text-2xl bg-gradient-to-b from-white to-slate-400 font-semibold',
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
        {...props}>
        Formizee.
      </Comp>
    );
  }
);
Logo.displayName = 'Logo';

export {Logo, logoVariants};
