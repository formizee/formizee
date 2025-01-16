import {planConfig, type WorkspacePlans} from '@formizee/plans';
import {Button, cn, Separator} from '@formizee/ui';
import {
  ConsoleIcon,
  DocumentIcon,
  KeyIcon,
  MailIcon,
  ServerIcon,
  UserGroupIcon
} from '@formizee/ui/icons';
import Link from 'next/link';

interface Props {
  workspacePlan: WorkspacePlans;
  plan: WorkspacePlans;
  workspaceId: string;
}

const getStorageSize = (size: number) => {
  if (size >= 1000) {
    return `${(size / 1000).toFixed(0)} GB`;
  }
  return `${size} MB`;
};

const UpgradeButton = (props: {
  workspaceId: string;
  plan: WorkspacePlans;
  workspacePlan: WorkspacePlans;
}) => {
  if (props.plan === 'teams') {
    return (
      <Button
        disabled
        variant="ghost"
        className="w-full text-neutral-600 dark:text-neutral-400"
      >
        Coming Soon...
      </Button>
    );
  }

  if (props.workspacePlan === 'hobby') {
    if (props.plan === 'hobby') {
      return (
        <Button disabled variant="outline" className="w-full">
          Current Plan
        </Button>
      );
    }

    if (props.plan === 'pro') {
      return (
        <Button asChild className="w-full">
          <Link
            href={`/api/billing/pro/checkout?workspaceId=${props.workspaceId}`}
          >
            Upgrade
          </Link>
        </Button>
      );
    }
  }

  if (props.workspacePlan === 'pro') {
    if (props.plan === 'hobby') {
      return (
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/api/billing/portal?workspaceId=${props.workspaceId}`}>
            Change Plan
          </Link>
        </Button>
      );
    }

    if (props.plan === 'pro') {
      return (
        <Button disabled className="w-full">
          Current Plan
        </Button>
      );
    }
  }
};

const Feature = (props: {
  children: React.ReactNode;
  title: string;
  icon: React.ElementType;
}) => (
  <div className="flex flex-row items-center justify-between w-full mb-4">
    <span className="flex flex-row items-center text-sm">
      <props.icon className="size-[0.8rem] mr-2" />
      {props.title}
    </span>
    <span className="text-xs font-semibold">{props.children}</span>
  </div>
);

export const PlanWidget = (props: Props) => {
  return (
    <div
      className={cn(
        props.plan === 'pro' ? 'border-l dark:border-neutral-800' : '',
        'flex flex-1 flex-col items-center gap-2 p-2 px-4 h-full justify-between'
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-lg">
          {planConfig[props.plan].title}
        </span>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {planConfig[props.plan].description}
        </p>
      </div>
      <span className="font-semibold text-lg my-4">
        ${planConfig[props.plan].price} / month
      </span>
      <Separator />
      <p className="text-sm text-neutral-600 dark:text-neutral-400 my-4">
        {planConfig[props.plan].limits.submissions.toLocaleString()} Submissions
        / mo
      </p>
      <Separator className="mb-4" />
      <div className="flex flex-col justify-between h-full w-full">
        <div>
          <Feature title="API Daily Requests" icon={ConsoleIcon}>
            {planConfig[props.plan].limits.apiDailyRequests.toLocaleString()}
          </Feature>
          <Feature title="Forms" icon={DocumentIcon}>
            {planConfig[props.plan].limits.endpoints.toLocaleString()}
          </Feature>
          <Feature title="API Keys" icon={KeyIcon}>
            {planConfig[props.plan].limits.keys.toLocaleString()}
          </Feature>
          <Feature title="Members" icon={UserGroupIcon}>
            {planConfig[props.plan].limits.members}
          </Feature>
          <Feature title="Storage" icon={ServerIcon}>
            {getStorageSize(planConfig[props.plan].limits.storage)}
          </Feature>
          <Feature title="Support" icon={MailIcon}>
            {planConfig[props.plan].limits.support.charAt(0).toUpperCase() +
              planConfig[props.plan].limits.support.slice(1)}
          </Feature>
        </div>
        <UpgradeButton {...props} />
      </div>
    </div>
  );
};
