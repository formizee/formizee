import {IconProps} from './types';
import {cn} from '@/lib/ui';

export const CheckIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={cn('h-4 w-4', props.className)}>
    <path
      fillRule="evenodd"
      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
      clipRule="evenodd"
    />
  </svg>
);
