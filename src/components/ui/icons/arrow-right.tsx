import {IconProps} from './types';
import {cn} from '@/lib/ui';

export const ArrowRightIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={cn('h-4 w-4', props.className)}>
    <path
      fillRule="evenodd"
      d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
      clipRule="evenodd"
    />
  </svg>
);
