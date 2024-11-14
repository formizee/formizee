'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@formizee/ui';
import {SearchIcon} from '@formizee/ui/icons';
import {SidebarMenuButton, SidebarMenuItem} from '@formizee/ui/sidebar';
import {Icon} from '../icon';
import {type Dispatch, type SetStateAction, useEffect, useState} from 'react';
import {api} from '@/trpc/client';
import {useRouter} from 'next/navigation';
import {useSettings} from '../settings';

interface Props {
  workspaceSlug: string;
}

export function SearchPalette(props: Props) {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!settings.open) {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey) && !open) {
          e.preventDefault();
          setOpen(true);
        }

        if (e.key === 'Escape' && open) {
          e.preventDefault();
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [settings.open]);

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
          <CommandGroup heading="Forms">
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
          </CommandGroup>
        </CommandList>
        <div className="flex justify-between gap-2 p-2 border-t text-neutral-400 dark:text-neutral-500 border-t-neutral-200 dark:border-t-neutral-800">
          <div className="flex flex-row gap-2">
            <div className="flex flex-row text-xs gap-2 items-center">
              <div className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded-sm">
                <svg
                  className="w-[12px]  h-[12px] fill-neutral-400 dark:fill-neutral-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.11 2.385a.61.61 0 01.48-.211c.191 0 .353.07.486.21L8.03 5.409a.66.66 0 01.2.475c0 .191-.061.347-.182.469a.627.627 0 01-.463.181.59.59 0 01-.451-.187L5.926 5.098l-.72-.844.04 1.219v7.242a.624.624 0 01-.187.469.624.624 0 01-.47.187.636.636 0 01-.468-.187.635.635 0 01-.182-.47V5.474l.041-1.22-.726.845-1.201 1.248a.61.61 0 01-.457.187.627.627 0 01-.463-.181.634.634 0 01-.182-.47.66.66 0 01.2-.474l2.958-3.023zm7.786 10.781a.636.636 0 01-.486.205.665.665 0 01-.486-.205l-2.947-3.035a.64.64 0 01-.206-.475c0-.191.061-.345.182-.463a.634.634 0 01.469-.181c.18 0 .33.06.451.181l1.201 1.248.727.85-.041-1.219V2.824c0-.187.06-.342.181-.463a.636.636 0 01.47-.187.627.627 0 01.65.65v7.248l-.041 1.219.726-.85 1.207-1.248a.6.6 0 01.451-.181c.188 0 .342.06.463.181a.615.615 0 01.182.463.648.648 0 01-.2.475l-2.953 3.035z" />
                </svg>
              </div>
              Select
            </div>
            <div className="flex flex-row text-xs gap-2 items-center">
              <div className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded-sm">
                <svg
                  className="w-[12px]  h-[12px] fill-neutral-400 dark:fill-neutral-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.38965 14.1667C5.81812 14.1667 6.10156 13.8767 6.10156 13.468C6.10156 13.2571 6.01587 13.0989 5.89062 12.967L4.18994 11.3125L3.02979 10.3369L4.55908 10.4028H12.7922C14.4402 10.4028 15.1389 9.65796 15.1389 8.04297V4.13403C15.1389 2.48608 14.4402 1.78735 12.7922 1.78735H9.13379C8.70532 1.78735 8.4021 2.11035 8.4021 2.50586C8.4021 2.90137 8.69873 3.22437 9.13379 3.22437H12.7593C13.4316 3.22437 13.7151 3.50781 13.7151 4.17358V7.99683C13.7151 8.67578 13.425 8.95923 12.7593 8.95923H4.55908L3.02979 9.03174L4.18994 8.04956L5.89062 6.39502C6.01587 6.26978 6.10156 6.11157 6.10156 5.89404C6.10156 5.48535 5.81812 5.19531 5.38965 5.19531C5.21167 5.19531 5.01392 5.27441 4.8689 5.41943L1.08521 9.1438C0.933594 9.28882 0.854492 9.48657 0.854492 9.68433C0.854492 9.87549 0.933594 10.0732 1.08521 10.2183L4.8689 13.9492C5.01392 14.0876 5.21167 14.1667 5.38965 14.1667Z" />
                </svg>
              </div>
              Open
            </div>
          </div>
          <div className="flex flex-row text-xs gap-2 items-center">
            <div className="bg-neutral-200 dark:bg-neutral-800 px-1 rounded-sm">
              <span className="text-[10px] font-semibold font-mono">ESC</span>
            </div>
            Close
          </div>
        </div>
      </CommandDialog>
    </>
  );
}

interface ItemProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
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
      <Icon
        className="mr-2"
        color={props.color}
        icon={props.icon}
        selected={true}
      />
      <span>{props.children}</span>
    </CommandItem>
  );
};
