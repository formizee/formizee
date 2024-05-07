'use client';

import {Card, CodeBlock} from '@/components/ui';

export const CodeCard = () => {
  const code = `<form action="https://formizee.com/f/zksmfkx" method="post">
  <input type="text" name="name"/>
  <input type="email" name="email"/>
  <button>Submit</button>
</form>`;

  return (
    <Card className="relative z-30 flex translate-x-[80px] justify-center shadow-card">
      <CodeBlock language="html">{code}</CodeBlock>
    </Card>
  );
};
