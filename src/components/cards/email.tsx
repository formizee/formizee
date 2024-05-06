'use client';

import {Card} from '@/components/ui';
import {useMemo, useState} from 'react';

const EMAILS: Array<Email> = [
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

export const EmailCard = () => {
  const [currentSelected, setCurrentSelected] = useState(0);
  const currentEmail = useMemo(() => {
    return EMAILS[currentSelected];
  }, [currentSelected]);

  const Item = (props: ItemProps) => {
    return (
      <button
        onClick={() => setCurrentSelected(props.id)}
        className={`flex w-[318px] flex-col justify-start m-2 p-2 rounded-md ${props.selected ? 'bg-neutral-700' : 'bg-neutral-800'}`}>
        <span className="text-md font-semibold">{props.title}</span>
        <span className="text-sm">{props.subject}</span>
        <span className="text-ellipsis text-sm text-neutral-400">
          {props.content}
        </span>
      </button>
    );
  };

  const Body = (props: BodyProps) => {
    return <p className="text-sm p-2">{props.children}</p>;
  };

  const Header = (props: HeaderProps) => {
    return (
      <header className="flex flex-row items-center gap-2 p-2 border-b-neutral-700 border-b-2">
        <div className="flex items-center justify-center rounded-full size-12 bg-neutral-700 font-bold">
          {props.title.substring(0, 1)}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{props.title}</span>
          <span className="text-sm text-neutral-400">{props.subject}</span>
          <span className="text-sm">
            Reply to:<span className="text-neutral-400">{props.replyTo}</span>
          </span>
        </div>
      </header>
    );
  };

  return (
    <Card className="flex flex-row p-0 relative translate-y-[-340px] translate-x-[130px] z-10 items-center justify-center">
      <div className="overflow-y-auto overflow-x-hidden h-full w-full">
        {EMAILS.map(item => (
          <Item
            id={item.id}
            key={item.id}
            title={item.title}
            subject={item.subject}
            content={item.content}
            selected={item.id === currentSelected}
          />
        ))}
      </div>
      <div className="border-l-neutral-700 border-l-2 h-full w-full">
        <Header
          title={currentEmail.title}
          subject={currentEmail.subject}
          replyTo={currentEmail.replyTo}
        />
        <Body>{currentEmail.content}</Body>
      </div>
    </Card>
  );
};

export default EmailCard;
