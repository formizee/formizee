import {cn} from '@formizee/ui';

interface LabelProps {
  variant?: 'active' | 'paused';
  className?: string;
  children: string;
}

export const Label = (props: LabelProps) => {
  const activeStyle =
    'border-green-500 dark:border-green-700 bg-green-100 dark:bg-green-950  text-neutral-700 dark:text-neutral-200';
  const pausedStyle =
    'border-yellow-500 dark:border-yellow-400 bg-yellow-400 dark:bg-yellow-500  text-neutral-50 dark:text-neutral-950';
  const variant = props.variant === 'active' ? activeStyle : pausedStyle;

  return (
    <span
      className={cn(
        props.className,
        variant,
        'px-3 border select-none rounded-xl text-sm font-medium'
      )}
    >
      {props.children}
    </span>
  );
};
