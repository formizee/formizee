import {cn} from '../lib/ui';
import type {IconProps} from './types';

export function EllipsisIcon(props: IconProps): JSX.Element {
  return (
    <svg
      className={cn('h-4 w-4', props.className)}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
    </svg>
  );
}
