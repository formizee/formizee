import {ClipboardIcon} from '@formizee/ui/icons';
import type {Example, Stack} from './types';
import {Button, toast} from '@formizee/ui';
import {STACKS} from './data';

interface TopbarProps {
  example: Example | undefined;
  stack: Stack | undefined;
  setStack: React.Dispatch<React.SetStateAction<Stack | undefined>>;
}

export const Topbar = ({example, stack, setStack}: TopbarProps) => {
  const copyCode = async () => {
    await navigator.clipboard.writeText(example?.code ?? '');
    toast({
      description: 'The code example is on your clipboard.'
    });
  };

  return (
    <nav className="flex flex-row w-full overflow-x-scroll overflow-y-hidden sm:overflow-x-visible sm:overflow-y-visible overflow-light-style dark:overflow-dark-style h-full pt-2">
      <div className="flex flex-row w-full border-b justify-between dark:border-neutral-800 px-2">
      <ul className="flex flex-row h-full justify-start items-end gap-2">
        {STACKS.map(item => {
          const selected = item.stack === stack?.stack;

          return (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => setStack(item)}
                className={`px-4 py-2 flex flex-row dark:bg-black items-center gap-2 -mb-[1px] shadow-none rounded-t-md border dark:border-neutral-800 ${selected ? 'bg-white dark:bg-dark border-b-white dark:border-b-black' : 'text-neutral-600 dark:text-neutral-400'}`}
              >
                <div className={selected ? item.color : ''}>
                  <item.icon />
                </div>
                <span className="font-secondary font-medium">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button
        onClick={copyCode}
        className="hidden sm:flex bg-white dark:bg-black shadow-none"
        variant="ghost"
        size="icon"
      >
        <ClipboardIcon />
      </Button>
      </div>
    </nav>
  );
};
