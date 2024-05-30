import {cn} from '../lib/ui';
import type {IconProps} from './types';

export function LoadingIcon(props: IconProps): JSX.Element {
  return (
    <svg
      className={cn('h-20 w-20 animate-spin duration-500', props.className)}
      fill="none"
      viewBox="0 0 100 100">
      <path
        d="M20 50A30 30 0 0 0 80 50A30 32 0 0 1 20 50"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
