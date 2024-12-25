import {NumberTicker} from '@/components/ticker';
import {BlurFade} from '@/components/blur-fade';
import {
  CodeIcon,
  DocumentIcon,
  InboxIcon,
  UserGroupIcon
} from '@formizee/ui/icons';

export const Metrics = () => (
  <BlurFade inView className="hidden md:flex">
    <article className="grid grid-cols-2 gap-x-8 gap-y-8 p-4 px-8">
      <MetricsItem label="Submissions Ingested" value={12432}>
        <InboxIcon className="size-4" />
      </MetricsItem>
      <MetricsItem label="Requests Proccessed" value={96349}>
        <CodeIcon className="size-4" />
      </MetricsItem>
      <MetricsItem label="Endpoints Hosted" value={103}>
        <DocumentIcon className="size-4" />
      </MetricsItem>
      <MetricsItem label="Workspaces Created" value={32}>
        <UserGroupIcon className="size-4" />
      </MetricsItem>
    </article>
  </BlurFade>
);

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