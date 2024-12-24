'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {ChevronDownIcon} from '../../icons';
import {cn} from '../../lib/ui';
import * as React from 'react';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({className, ...props}, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b dark:border-neutral-800', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all text-left [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden leading-relaxed text-neutral-600 dark:text-neutral-400 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent};
