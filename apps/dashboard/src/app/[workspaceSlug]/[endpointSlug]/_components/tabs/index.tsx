import {Button} from '@formizee/ui';
import Link from 'next/link';

import {
  HomeIcon,
  InboxIcon,
  PluginIcon,
  SettingsIcon
} from '@formizee/ui/icons';

interface Props {
  workspaceSlug: string;
  endpointSlug: string;
  currentPath: string;
}

const data = [
  {
    name: 'Overview',
    icon: HomeIcon,
    path: ''
  },
  {
    name: 'Submissions',
    icon: InboxIcon,
    path: '/submissions'
  },
  {
    name: 'Integrations',
    icon: PluginIcon,
    path: '/integrations'
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    path: '/settings'
  }
];

export const Tabs = (props: Props) => {
  return (
    <nav className="flex flex-row gap-2">
      {data.map(tab => {
        const href = `/${props.workspaceSlug}/${props.endpointSlug}${tab.path}`;

        return (
          <TabItem
            href={href}
            key={tab.name}
            icon={tab.icon}
            name={tab.name}
            isSelected={props.currentPath === href}
          />
        );
      })}
    </nav>
  );
};

interface ItemProps {
  icon: React.ElementType;
  isSelected: boolean;
  href: string;
  name: string;
}

const TabItem = (props: ItemProps) => {
  return (
    <Button
      key={props.name}
      asChild
      variant={props.isSelected ? 'outline' : 'ghost'}
    >
      <Link href={props.href}>
        <props.icon
          className={
            props.isSelected
              ? 'text-neutral-950 dark:text-neutral-50'
              : 'text-neutral-400 dark:text-neutral-600'
          }
        />
        <span
          className={
            props.isSelected
              ? 'text-neutral-950 dark:text-neutral-50'
              : 'text-neutral-600 dark:text-neutral-400'
          }
        >
          {props.name}
        </span>
      </Link>
    </Button>
  );
};
