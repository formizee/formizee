import {cn} from '../lib/ui';
import type {IconProps} from './types';

export function FaceFrownIcon(props: IconProps): JSX.Element {
  return (
    <svg
      className={cn('h-4 w-4', props.className)}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM6 8c.552 0 1-.672 1-1.5S6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8Zm5-1.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5Zm-6.005 5.805a.75.75 0 0 0 1.06 0 2.75 2.75 0 0 1 3.89 0 .75.75 0 0 0 1.06-1.06 4.25 4.25 0 0 0-6.01 0 .75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
    </svg>
  );
}
