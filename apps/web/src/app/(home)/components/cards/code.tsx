'use client';

import {Card, CodeBlock} from '@formizee/ui';
import {ClipboardButton} from '@/components';

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
        className="absolute bottom-3 right-3 hidden 2xl:flex"
      />
    </Card>
  );
}
