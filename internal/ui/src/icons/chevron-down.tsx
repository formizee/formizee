import {cn} from '../lib/ui';
import type {IconProps} from './types';

export function ChevronDownIcon(props: IconProps): JSX.Element {
  return (
    <svg
      className={cn('h-4 w-4', props.className)}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
