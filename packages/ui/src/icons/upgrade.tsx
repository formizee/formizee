import { cn } from '../lib/ui';
import type { IconProps } from './types';

export function UpgradeIcon(props: IconProps): JSX.Element {
  return (
    <svg
      className={cn('h-4 w-4', props.className)}
      strokeWidth={2}
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}
