'use client';

import {NumberTicker} from '@/components/ticker';
import {BlurFade} from '@/components/blur-fade';

import {
  CodeIcon,
  DocumentIcon,
  InboxIcon,
  UserGroupIcon
} from '@formizee/ui/icons';
import {useEffect, useState} from 'react';

export const Metrics = () => {
  const [data, setData] = useState({
    submissions: 0,
    requests: 0,
    endpoints: 0,
    workspaces: 0
  });

  useEffect(() => {
    fetch('/api/stadistics').then(async res => {
      const data = await res.json();
      setData(data);
    });
  }, []);

  return (
    <BlurFade inView className="hidden md:flex">
      <article className="grid grid-cols-2 gap-x-8 gap-y-8 p-4 px-8">
        <MetricsItem label="Submissions Ingested" value={data.submissions}>
          <InboxIcon className="size-4" />
        </MetricsItem>
        <MetricsItem label="Requests Proccessed" value={data.requests}>
          <CodeIcon className="size-4" />
        </MetricsItem>
        <MetricsItem label="Endpoints Hosted" value={data.endpoints}>
          <DocumentIcon className="size-4" />
        </MetricsItem>
        <MetricsItem label="Workspaces Created" value={data.workspaces}>
          <UserGroupIcon className="size-4" />
        </MetricsItem>
      </article>
    </BlurFade>
  );
};

interface ItemProps {
  label: string;
  value: number;
  children: React.ReactNode;
}

const MetricsItem = (props: ItemProps) => {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="flex items-center justify-center size-12 min-h-12 min-w-12 bg-white dark:bg-black/30 border dark:border-neutral-800 rounded-md">
        {props.children}
      </div>
      <span className="flex flex-col items-start w-40">
        <span>
          <NumberTicker
            className="text-2xl font-bold font-secondary"
            value={props.value}
          />
        </span>
        <span className="text-sm font-secondary text-nowrap">
          {props.label}
        </span>
      </span>
    </div>
  );
};

export default Metrics;