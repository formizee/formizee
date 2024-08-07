'use client';

import {Card} from '@formizee/ui';
import {useMemo, useState} from 'react';

const EMAILS: Email[] = [
  {
    id: 0,
    title: 'Formizee.',
    replyTo: 'noreply@formizee.com',
    subject: 'New submission from your form',
    content: 'You’ve received a new submission from you...'
  },
  {
    id: 1,
    title: 'Acme',
    replyTo: 'noreply@acme.com',
    subject: 'Your shipping is about to arrive',
    content: 'The delivery man has already picked up the...'
  },
  {
    id: 2,
    title: 'Github',
    replyTo: 'noreply@github.com',
    subject: '[Github] Your Dependabot alerts',
    content: 'Explore this week on Github security alert...'
  }
];

interface Email {
  id: number;
  title: string;
  replyTo: string;
  subject: string;
  content: string;
}

interface ItemProps extends Omit<Email, 'replyTo'> {
  setCurrentSelected: (_id: number) => void;
  selected: boolean;
}

interface HeaderProps {
  title: string;
  subject: string;
  replyTo: string;
}

interface BodyProps {
  children: React.ReactNode;
}

function Item(props: ItemProps): JSX.Element {
  return (
    <div
      className={`m-2 flex h-50 w-[318px] flex-col justify-start rounded-md p-2 ${props.selected ? 'bg-neutral-700' : 'bg-neutral-800'}`}
      tabIndex={-1}
    >
      <span className="font-semibold text-md">{props.title}</span>
      <span className="text-sm">{props.subject}</span>
      <span className="text-ellipsis text-neutral-400 text-sm">
        {props.content}
      </span>
    </div>
  );
}

function Body(props: BodyProps): JSX.Element {
  return <p className="p-2 text-sm">{props.children}</p>;
}

function Header(props: HeaderProps): JSX.Element {
  return (
    <header className="flex flex-row items-center gap-2 border-b-2 border-b-neutral-700 p-2">
      <div className="flex size-12 items-center justify-center rounded-full bg-neutral-700 font-bold">
        {props.title.substring(0, 1)}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">{props.title}</span>
        <span className="text-neutral-400 text-sm">{props.subject}</span>
        <span className="text-sm">
          Reply to:<span className="text-neutral-400">{props.replyTo}</span>
        </span>
      </div>
    </header>
  );
}

export function EmailCard(): JSX.Element {
  const [currentSelected, setCurrentSelected] = useState(0);
  const currentEmail = useMemo(() => {
    return EMAILS[currentSelected];
  }, [currentSelected]);

  return (
    <Card
      className="z-10 h-[216px] translate-x-[120px] translate-y-[-385px]"
      size="landing"
      variant="landing"
    >
      <div className="relative flex flex-row items-center justify-center p-0">
        <div className="mt-0 h-full w-[48%] overflow-hidden">
          {EMAILS.map(item => (
            <Item
              content={item.content}
              id={item.id}
              key={item.id}
              selected={item.id === currentSelected}
              setCurrentSelected={setCurrentSelected}
              subject={item.subject}
              title={item.title}
            />
          ))}
        </div>
        <div className="h-full w-[52%] border-l-2 border-l-neutral-700">
          <Header
            replyTo={currentEmail?.replyTo ?? ''}
            subject={currentEmail?.subject ?? ''}
            title={currentEmail?.title ?? ''}
          />
          <Body>{currentEmail?.content}</Body>
        </div>
      </div>
    </Card>
  );
}

export default EmailCard;
