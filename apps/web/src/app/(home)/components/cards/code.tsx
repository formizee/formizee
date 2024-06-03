'use client';

import { Button, Card, CodeBlock, Tooltip, TooltipContent, TooltipTrigger } from '@formizee/ui';
import { ClipboardIcon, CheckIcon } from '@formizee/ui/icons';
import { useEffect, useState } from 'react';

const code = `<form action="https://formizee.com/f/123456" method="post">
  <input type="text" name="name"/>
  <input type="email" name="email"/>
  <button>Submit</button>
</form>`;

export function CodeCard(): JSX.Element {
  const [onClipboard, setOnClipboard] = useState(false);

  function Icon(): JSX.Element {
    if(onClipboard) return <CheckIcon className="fill-amber-400 animate-fade-in"/>
    else return <ClipboardIcon className="animate-fade-in"/>
  }

  function onClick(): void {
    setOnClipboard(true);
    navigator.clipboard.writeText(code);
  }

  useEffect(() =>{
    if(onClipboard) setTimeout(() => {
      setOnClipboard(false);
    }, 3000);

  }, [onClipboard, setOnClipboard])

  return (
    <Card
      className="relative z-30 flex translate-x-[80px] justify-center"
      size="landing"
      variant="animated">
      <CodeBlock language="html">{code}</CodeBlock>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={onClick} size="icon" className="absolute right-3 bottom-3">
            <Icon/>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          Copy Code
        </TooltipContent>
      </Tooltip>
    </Card>
  );
}
