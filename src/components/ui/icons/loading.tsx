import {IconProps} from './types';
import {cn} from '@/lib/ui';

export const LoadingIcon = (props: IconProps) => (
  <svg
    fill="none"
    viewBox="0 0 100 100"
    className={cn('h-20 w-20 animate-spin duration-500', props.className)}>
    <path
      stroke="none"
      fill="currentColor"
      d="M20 50A30 30 0 0 0 80 50A30 32 0 0 1 20 50"
    />
  </svg>
);
