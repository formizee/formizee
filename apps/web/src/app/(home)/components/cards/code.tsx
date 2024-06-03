"use client";

import { ClipboardButton } from '@/components';
import { Card, CodeBlock } from '@formizee/ui';

const code = `<form action="https://formizee.com/f/123456" method="post">
  <input type="text" name="name"/>
  <input type="email" name="email"/>
  <button>Submit</button>
</form>`;

export function CodeCard(): JSX.Element {
  return (
    <Card
      className="relative z-30 flex translate-x-[80px] justify-center"
      size="landing"
      variant="animated">
      <CodeBlock language="html">{code}</CodeBlock>
      <ClipboardButton 
        data={code}
        side="left"
        tooltip="Copy Code"
        className="2xl:flex hidden absolute bottom-3 right-3"
      />
    </Card>
  );
}
