import {cn} from '@formizee/ui';

interface LabelProps {
  variant?: 'active' | 'paused';
  className?: string;
  children: string;
}

export const Label = (props: LabelProps) => {
  const activeStyle =
    'border-green-300 dark:border-green-700  text-green-700 dark:text-green-100';
  const pausedStyle =
    'border-yellow-300 dark:border-yellow-700  text-neutral-700 dark:text-neutral-100';
  const variant = props.variant === 'active' ? activeStyle : pausedStyle;

  return (
    <span
      className={cn(
        props.className,
        variant,
        'px-3 border select-none rounded-xl text-sm'
      )}
    >
      {props.children}
    </span>
  );
};
