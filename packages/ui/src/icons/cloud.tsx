import {cn} from '../lib/ui';
import type {IconProps} from './types';

export function CloudIcon(props: IconProps): JSX.Element {
  return (
    <svg
      className={cn('h-4 w-4', props.className)}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M1 9.5A3.5 3.5 0 0 0 4.5 13H12a3 3 0 0 0 .917-5.857 2.503 2.503 0 0 0-3.198-3.019 3.5 3.5 0 0 0-6.628 2.171A3.5 3.5 0 0 0 1 9.5Z" />
    </svg>
  );
}
