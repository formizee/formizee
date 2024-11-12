'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@formizee/ui';
import {SearchIcon} from '@formizee/ui/icons';
import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';
import {Icon} from '../icon';
import {type Dispatch, type SetStateAction, useEffect, useState} from 'react';
import {api} from '@/trpc/client';
import {useRouter} from 'next/navigation';

interface Props {
  workspaceSlug: string;
}

export function SearchPalette(props: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const {data} = api.endpoint.list.useQuery({
    workspaceSlug: props.workspaceSlug
  });

  const endpoints = data ?? [];

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(open => !open)}
          className="text-neutral-600 dark:text-neutral-400 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <SearchIcon />
          <span>Search</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          className="border-red-400"
          placeholder="Search within your workspace..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          {endpoints.map(endpoint => (
            <Item
              href={`/${props.workspaceSlug}/${endpoint.slug}`}
              color={endpoint.color}
              icon={endpoint.icon}
              setOpen={setOpen}
              key={endpoint.id}
            >
              {endpoint.name}
            </Item>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

interface ItemProps {
  children: React.ReactNode;
  setOpen: Dispatch<SetStateAction<boolean>>;
  color: string;
  href: string;
  icon: string;
}

export const Item = (props: ItemProps) => {
  const router = useRouter();

  const onSelect = () => {
    router.push(props.href);
    props.setOpen(false);
  };

  return (
    <CommandItem onSelect={onSelect}>
      <Icon color={props.color} icon={props.icon} selected={true} />
      <span>{props.children}</span>
    </CommandItem>
  );
};
