import {type Color, getColor} from '@/lib/colors';
import {ClipboardIcon, LinkIcon} from '@formizee/ui/icons';
import Link from 'next/link';

import {Button, cn, toast} from '@formizee/ui';

interface Props {
  id: string;
  color: Color;
}

export const OnboardingCard = (props: Props) => {
  const endpointUrl = `https://formizee.com/f/${props.id}`;

  const copyID = () => {
    navigator.clipboard.writeText(endpointUrl).then(() => {
      toast({
        variant: 'success',
        description: 'The URL has been copied to the clipboard.'
      });
    });
  };

  return (
    <div className="flex flex-col w-full gap-4 p-4 mt-4 rounded-md border dark:border-neutral-800">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Integrate Your Form</span>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          This is the URL of this form
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div
          className={
            'flex items-center h-[2.3rem] pl-4 border dark:border-neutral-800 rounded-md'
          }
        >
          <div className="border-r dark:border-r-neutral-800 mr-2">
            <span
              className={cn(
                getColor(props.color, true).text,
                'text-sm font-semibold mr-4 select-none'
              )}
            >
              POST
            </span>
          </div>
          <span className="text-sm flex-1 text-neutral-600 dark:text-neutral-400 truncate">
            {endpointUrl}
          </span>
          <Button
            variant="ghost"
            className="ml-2 rounded-l-none hover:rounded-l-none"
            size="icon"
            onClick={copyID}
          >
            <ClipboardIcon className="text-neutral-600 dark:text-neutral-400" />
          </Button>
        </div>
        <Button className="hidden sm:hidden md:flex" variant="outline" asChild>
          <Link href="https://docs.formizee.com">
            Quick Start
            <LinkIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
};
