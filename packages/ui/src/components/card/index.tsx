import * as React from 'react';
import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import {cn} from '../../lib/ui';

const cardVariants = cva(
  'relative flex flex-col ',
  {
    variants: {
      variant: {
        default: 'rounded-lg shadow-md backdrop-blur-md',
        animated: 'rounded-xl bg-neutral-900',
        landing: 'overflow-clip rounded-xl border-2 border-neutral-700 bg-neutral-900/80 shadow-md backdrop-blur-md',
        auth: 'z-10 flex items-center justify-center rounded-xl bg-transparent shadow-lg backdrop-blur-sm'
      },
      size: {
        default: 'min-h-48 min-w-[200px] p-4',
        landing: 'w-[700px] p-4',
        auth: 'h-[310px] p-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({className, variant, size, ...props}, ref) => (
    <div className={cn(className, "relative inline-flex overflow-hidden rounded-xl p-[2px]")}>
      {variant === 'animated' ? 
        (<span className="absolute inset-[-1000%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,#404040_0%,#404040_60%,#fbbf24_90%,#fef3c7_100%)]" />)
        : (<div/>)}
      <div
        className={cn(cardVariants({variant, size}))}
        ref={ref}
        {...props}>
        {props.children}
        <svg className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-xl">
          <rect
            className="h-full w-full fill-red-400 opacity-15"
            filter="url(#grainy)"
          />
          <filter id="grainy">
            <feTurbulence baseFrequency="0.65" type="turbulence" />
          </filter>
        </svg>
      </div>
    </div>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    ref={ref}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({className, children, ...props}, ref) => (
  <h3
    className={cn('font-semibold leading-none tracking-tight', className)}
    ref={ref}
    {...props}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
  <p
    className={cn('text-muted-foreground text-sm', className)}
    ref={ref}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div className={cn('p-6 pt-0', className)} ref={ref} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    className={cn('flex items-center p-6 pt-0', className)}
    ref={ref}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent};
