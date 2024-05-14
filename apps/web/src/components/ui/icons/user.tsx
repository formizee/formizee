import {IconProps} from './types';
import {cn} from '@/lib/ui';

export const UserIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={cn('h-4 w-4', props.className)}>
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
);
