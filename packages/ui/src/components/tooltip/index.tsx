'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {cn} from '../../lib/ui';

function Tooltip(props: {children: React.ReactNode}): JSX.Element {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>{props.children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({className, sideOffset = 4, ...props}, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    avoidCollisions
    sideOffset={sideOffset}
    className={cn(
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md border bg-neutral-200 px-3 py-1.5 text-xs text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:backdrop-blur-sm',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {Tooltip, TooltipTrigger, TooltipContent};
