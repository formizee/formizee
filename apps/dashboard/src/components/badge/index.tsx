import {cn} from '@formizee/ui';

export const Badge = (props: {
  variant?: 'green' | 'blue' | 'yellow' | 'red';
  children: React.ReactNode;
  className?: string;
}) => {
  const variants = {
    yellow:
      'bg-amber-200/30 dark:bg-amber-800/30 border-amber-400 dark:border-amber-600 dark:text-amber-600 text-amber-400',
    green:
      'bg-green-200/30 dark:bg-green-800/30 border-green-400 dark:border-green-600 dark:text-green-600 text-green-400',
    blue: 'bg-blue-200/30 dark:bg-blue-800/30 border-blue-400 dark:border-blue-600 dark:text-blue-600 text-blue-400',
    red: 'bg-red-200/30 dark:bg-red-800/30 border-red-400 dark:border-red-600 dark:text-red-600 text-red-400'
  };

  return (
    <span
      className={cn(
        props.className,
        variants[props.variant ?? 'green'],
        'flex max-w-16 justify-center items-center text-xs rounded-2xl border px-2 py-1 font-secondary font-semibold'
      )}
    >
      {props.children}
    </span>
  );
};
