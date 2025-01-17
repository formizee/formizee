'use client';

import * as React from 'react';
import {CheckIcon, ChevronUpDownIcon} from '@formizee/ui/icons';

import {
  cn,
  Button,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@formizee/ui';

interface Props {
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  selectedValues: string[];
  emails: string[];
}

export function MultiSelectInput(props: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');

  const toggleItem = (item: string) => {
    props.setSelectedValues(currentItem =>
      !currentItem.includes(item)
        ? [...currentItem, item]
        : currentItem.filter(l => l !== item)
    );
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
    if (value === false) {
    }
  };

  return (
    <div className="max-w-96">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-80 sm:w-96 justify-between text-foreground"
          >
            <span className="truncate">
              {props.selectedValues.length === 0 && 'Select emails'}
              {props.selectedValues.length === 1 && props.selectedValues[0]}
              {props.selectedValues.length === 2 &&
                props.selectedValues.join(', ')}
              {props.selectedValues.length > 2 &&
                `${props.selectedValues.length} emails selected`}
            </span>
            <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 sm:w-96 dark:border-neutral-800 p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search Emails..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {props.emails.map(email => {
                  const isActive = props.selectedValues.includes(email);
                  return (
                    <CommandItem
                      key={email}
                      value={email}
                      onSelect={() => toggleItem(email)}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          isActive ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex-1">{email}</div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
