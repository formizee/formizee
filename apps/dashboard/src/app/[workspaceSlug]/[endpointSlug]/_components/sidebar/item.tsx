'use client';

import {DocumentIcon} from '@formizee/ui/icons';
import {Button} from '@formizee/ui';
import Link from 'next/link';

interface EndpointItemProps {
  children: React.ReactNode;
  workspaceSlug: string;
  selected: boolean;
  color: string;
  slug: string;
  icon: string;
}

const Icon = (props: {icon: string; color: string; selected: boolean}) => {
  const getColor = (color: string, selected: boolean) => {
    switch (color) {
      default:
        return selected
          ? 'fill-neutral-950 dark:fill-neutral-50'
          : 'fill-neutral-500 dark:fill-neutral-400';
    }
  };

  switch (props.icon) {
    default:
      return <DocumentIcon className={getColor(props.color, props.selected)} />;
  }
};

export const EndpointItem = (props: EndpointItemProps) => {
  return (
    <Button
      asChild
      variant={props.selected ? 'outline' : 'ghost'}
      className="flex animate-fade-in duration-100"
    >
      <Link href={`/${props.workspaceSlug}/${props.slug}`}>
        <div className="flex flex-row w-full items-center gap-2 justify-start">
          <Icon
            icon={props.icon}
            color={props.color}
            selected={props.selected}
          />
          <span
            className={
              props.selected
                ? 'text-neutral-950 dark:text-neutral-50'
                : 'text-neutral-500 dark:text-neutral-400'
            }
          >
            {props.children}
          </span>
        </div>
      </Link>
    </Button>
  );
};

export default EndpointItem;
