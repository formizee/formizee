'use client';

import {Button, Tooltip, TooltipContent, TooltipTrigger} from '@formizee/ui';
import {CheckIcon, ClipboardIcon} from '@formizee/ui/icons';
import {useEffect, useState} from 'react';

interface ClipboardButtonProps {
  data: string;
  tooltip?: string;
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export function ClipboardButton(props: ClipboardButtonProps): JSX.Element {
  const [onClipboard, setOnClipboard] = useState(false);

  const onClick = async (): Promise<void> => {
    setOnClipboard(true);
    await navigator.clipboard.writeText(props.data);
  };

  useEffect(() => {
    if (onClipboard)
      setTimeout(() => {
        setOnClipboard(false);
      }, 2000);
  }, [onClipboard, setOnClipboard]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          aria-label={props.tooltip}
          className={props.className}
          variant="outline"
          size="icon">
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
  );
}
