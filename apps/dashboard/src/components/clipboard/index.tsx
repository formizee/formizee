'use client';

import {
  Button,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@formizee/ui';
import {CheckIcon, ClipboardIcon} from '@formizee/ui/icons';
import {useEffect, useState} from 'react';

interface ClipboardButtonProps {
  data: string;
  tooltip?: string;
  className?: string;
  description?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export function ClipboardButton(props: ClipboardButtonProps): JSX.Element {
  const [onClipboard, setOnClipboard] = useState(false);

  const onClick = async (): Promise<void> => {
    setOnClipboard(true);
    await navigator.clipboard.writeText(props.data);
    toast({
      description: props.description ?? 'The data is copied to your clipboard'
    });
  };

  useEffect(() => {
    if (onClipboard) {
      setTimeout(() => {
        setOnClipboard(false);
      }, 2000);
    }
  }, [onClipboard, setOnClipboard]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            aria-label={props.tooltip}
            className={props.className}
            variant="outline"
            size="icon"
          >
            {onClipboard ? (
              <CheckIcon className="fill-amber-400" />
            ) : (
              <ClipboardIcon className="animate-fade-in" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={props.side ?? 'top'}>
          {props.tooltip ?? 'Copy'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
