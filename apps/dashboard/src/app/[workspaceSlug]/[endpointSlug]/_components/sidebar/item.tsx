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

  const onClick = () => {
    router.push(`/${props.workspaceSlug}/${props.slug}`);
  };

  return (
    <Button onClick={onClick} variant={props.selected ? 'outline' : 'ghost'}>
      <div className="flex flex-row w-full items-center gap-2 justify-start">
        <Icon icon={props.icon} color={props.color} selected={props.selected} />
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
      </div>
    </Button>
  );
};

export default EndpointItem;
