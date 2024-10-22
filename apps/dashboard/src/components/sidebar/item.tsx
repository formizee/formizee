'use client';

import {useRouter} from 'next/navigation';
import {Button, cn} from '@formizee/ui';
import {Icon} from '@/components';

interface EndpointItemProps {
  children: React.ReactNode;
  workspaceSlug: string;
  color: string;
  icon: string;
  selected: boolean;
  slug: string;
}

export const EndpointItem = (props: EndpointItemProps) => {
  const router = useRouter();

  return (
    <Button
      variant={props.selected ? 'outline' : 'ghost'}
      className="flex flex-row w-full items-center gap-2 justify-start"
      onClick={() => router.push(`/${props.workspaceSlug}/${props.slug}`)}
    >
      <Icon
        icon={props.icon}
        color={props.color}
        selected={props.selected}
        className="min-w-4"
      />
      <span
        className={cn(
          'truncate',
          props.selected
            ? 'text-neutral-950 dark:text-neutral-50'
            : 'text-neutral-500 dark:text-neutral-400'
        )}
      >
        {props.children}
      </span>
    </Button>
  );
};

export default EndpointItem;
