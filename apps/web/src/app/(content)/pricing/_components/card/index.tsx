import {getPlanConfig, type Plan} from '@formizee/plans';
import teamsPlanIcon from '@/../public/teams.webp';
import hobbyPlanIcon from '@/../public/hobby.webp';
import proPlanIcon from '@/../public/pro.webp';

import {
  ChatIcon,
  CodeIcon,
  KeyIcon,
  ServerIcon,
  DocumentIcon,
  UserGroupIcon,
  CheckIcon,
  BoltIcon
} from '@formizee/ui/icons';
import Image from 'next/image';
import {BorderBeam} from '@/components/beam';
import {Button} from '@formizee/ui';
import Link from 'next/link';

const getStorageSize = (size: number) => {
  if (size >= 1000) {
    return `${(size / 1000).toFixed(0)} GB`;
  }
  return `${size} MB`;
};

const PricingItem = (props: {
  label: string;
  limit: string;
  children: React.ReactNode;
}) => (
  <li className="flex flex-row items-center gap-4 py-2 justify-between">
    <span className="flex flex-row gap-2 items-center">
      {props.children} {props.label}
    </span>
    <span className="font-semibold">{props.limit}</span>
  </li>
);

interface CardProps {
  plan: Plan;
}

export const PricingCard = (props: CardProps) => {
  const plan = getPlanConfig(props.plan);

  return (
    <article className="flex w-full max-w-80 sm:max-w-96 flex-col items-center border dark:border-neutral-800 rounded-lg p-4 shadow-md">
      <div className="relative mt-2 mb-4 flex w-16 h-16 overflow-hidden rounded-lg bg-background md:shadow-xl">
        <Image
          src={props.plan === 'hobby' ? hobbyPlanIcon : proPlanIcon}
          alt={`${plan.title} Plan Icon`}
          className="w-16 h-16"
        />
        <BorderBeam
          size={250}
          anchor={60}
          duration={2}
          borderWidth={3}
          colorTo={props.plan === 'hobby' ? '#444' : '#824710'}
          colorFrom={props.plan === 'hobby' ? '#AAA' : '#FFBE7B'}
        />
      </div>
      <h2 className="text-3xl font-bold">{plan.title} Plan</h2>
      <p className="mt-2 font-secondary">{plan.description}</p>
      <h3 className="flex flex-col items-center mb-4 mt-8">
        <span className="text-4xl font-bold">${plan.price}</span>
        <span className="text-md font-semibold">per month</span>
      </h3>
      <div className="mt-8 flex w-full flex-col items-start">
        <span className="mb-2 text-neutral-800 dark:text-neutral-200">
          What's included:
        </span>
        <ul className="flex flex-col w-full">
          <PricingItem
            label="API Daily Requests"
            limit={plan.limits.apiDailyRequests.toLocaleString('en-US')}
          >
            <CodeIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>
          <PricingItem
            label="Submissions"
            limit={plan.limits.submissions.toLocaleString('en-US')}
          >
            <BoltIcon className="text-neutral-950 dark:text-neutral-50" />
          </PricingItem>
          <PricingItem
            label="Forms"
            limit={plan.limits.endpoints.toLocaleString('en-US')}
          >
            <DocumentIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>
          <PricingItem
            label="API Keys"
            limit={plan.limits.keys.toLocaleString('en-US')}
          >
            <KeyIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>
          <PricingItem
            label="Members"
            limit={plan.limits.members.toLocaleString('en-US')}
          >
            <UserGroupIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>
          <PricingItem
            label="Storage"
            limit={getStorageSize(plan.limits.storage)}
          >
            <ServerIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>
          <PricingItem
            label="Support"
            limit={
              plan.limits.support[0]
                ?.toUpperCase()
                .concat(plan.limits.support.slice(1)) ?? ''
            }
          >
            <ChatIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>
          <PricingItem label="More Coming Soon..." limit="">
            <CheckIcon className="text-neutral-400 dark:text-neutral-500" />
          </PricingItem>

          <Button
            asChild
            className="mt-4 font-secondary border-2 hover:border-neutral-500 border-neutral-700 bg-neutral-900"
          >
            <Link href="https://dashboard.formizee.com">
              {props.plan === 'hobby'
                ? 'Start for Free'
                : 'Get Started with Pro'}
            </Link>
          </Button>
        </ul>
      </div>
    </article>
  );
};

export const TeamsPricingCard = () => {
  const plan = getPlanConfig('teams');

  return (
    <article className="flex mt-8  w-full max-w-80 sm:max-w-[50rem] flex-col border dark:border-neutral-800 rounded-lg p-4 shadow-md">
      <div className="flex flex-col items-center pb-4">
        <div className="relative mt-2 mb-4 flex w-16 h-16 overflow-hidden rounded-lg bg-background md:shadow-xl">
          <Image
            src={teamsPlanIcon}
            className="w-16 h-16"
            alt="Teams Plan Icon"
          />
          <BorderBeam size={250} anchor={60} duration={4} borderWidth={3} />
        </div>
        <h2 className="text-3xl font-bold">{plan.title} Plan</h2>
        <p className="mt-2 font-secondary">{plan.description}</p>
        <h3 className="mt-4 text-xl font-bold">Coming Soon...</h3>
      </div>
    </article>
  );
};
