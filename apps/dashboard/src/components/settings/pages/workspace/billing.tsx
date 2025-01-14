import {getLimits, planConfig, calculatePlanCycleDates} from '@formizee/plans';
import {WorkspaceBillingPageLoading} from '../../components/skeletons';
import {UsageWidget} from '../../components/billing/usage';
import {PageError} from '../../components/error';
import Transition from '@/components/transition';
import {Button, Separator} from '@formizee/ui';
import cardIcon from '@/../public/card.webp';
import {useSettings} from '../..';
import {api} from '@/trpc/client';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceBilling = (props: Props) => {
  const {setRoute} = useSettings();

  const workspaceRequest = api.workspace.get.useQuery({
    slug: props.workspaceSlug
  });

  const usageRequest = api.workspace.limits.useQuery({
    slug: props.workspaceSlug
  });

  if (usageRequest.error || workspaceRequest.error) {
    return <PageError />;
  }

  if (workspaceRequest.isLoading || usageRequest.isLoading) {
    return <WorkspaceBillingPageLoading />;
  }

  const workspace = workspaceRequest.data;
  const usage = usageRequest.data;

  const currentPlanLimits = getLimits(workspace.plan);

  const {endDate} = calculatePlanCycleDates(workspace);

  return (
    <Transition className="flex flex-col w-full mt-4">
      <div className="flex flex-row gap-4">
        <Image
          priority
          height={48}
          width={48}
          src={cardIcon}
          alt="Credit Card Icon"
          className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
        />
        <div className="flex flex-col gap-1 items-start">
          <span className="font-medium">Billing</span>
          <p className="font-secondary text-sm text-neutral-600 dark:text-neutral-400">
            The payment settings of the workspace
          </p>
        </div>
      </div>
      <span className="font-semibold mt-8">
        {workspace.plan.charAt(0).toUpperCase() + workspace.plan.slice(1)} Plan
      </span>
      <Separator className="mt-2 w-full" />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          <span className="flex flex-row w-full text-sm mt-4 justify-between">
            Next Billing At
            <span className="text-xs mr-4">{endDate.toDateString()}</span>
          </span>
          <span className="flex flex-row w-full text-sm my-4 justify-between">
            Total Due
            <span className=" text-sm mr-4 font-medium">
              ${planConfig[workspace.plan].price}
            </span>
          </span>
          <span className="font-semibold mt-8">Current Usage</span>
          <Separator className="mt-2 w-full" />
          <UsageWidget
            currentPlanLimits={currentPlanLimits}
            planFeature="apiDailyRequests"
            usage={usage.apiDailyRequests}
          >
            API Daily Requests
          </UsageWidget>
          <UsageWidget
            currentPlanLimits={currentPlanLimits}
            planFeature="submissions"
            usage={usage.submissions}
          >
            Monthly Submissions
          </UsageWidget>
          <UsageWidget
            currentPlanLimits={currentPlanLimits}
            planFeature="storage"
            usage={usage.storage}
          >
            Storage
          </UsageWidget>
          <UsageWidget
            currentPlanLimits={currentPlanLimits}
            planFeature="endpoints"
            usage={usage.endpoints}
          >
            Total Forms
          </UsageWidget>
          <UsageWidget
            currentPlanLimits={currentPlanLimits}
            planFeature="keys"
            usage={usage.keys}
          >
            Total Keys
          </UsageWidget>
          <UsageWidget
            currentPlanLimits={currentPlanLimits}
            planFeature="members"
            usage={usage.members}
          >
            Members
          </UsageWidget>
        </div>
        <div className="mt-4">
          {workspace.plan === 'hobby' ? (
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex flex-row gap-2">
                <Button onClick={() => setRoute('workspace.plans')}>
                  Upgrade Plan
                </Button>
              </div>
              <Link
                href="mailto:support@formizee.com"
                className="text-xs hover:border-b text-neutral-400 dark:text-neutral-600"
              >
                Contact Support
              </Link>
            </div>
          ) : (
            <div className="flex flex-row w-full justify-between items-center">
              <div className="flex flex-row gap-2">
                <Button asChild>
                  <Link href="https://formizee.com/pricing" target="_blank">
                    See Plan Features
                  </Link>
                </Button>
                <Button asChild variant="outline" className="py-2">
                  <Link
                    href={`/api/billing/portal?workspaceId=${workspace.id}`}
                  >
                    Manage Subscription
                  </Link>
                </Button>
              </div>
              <Link
                href="mailto:support@formizee.com"
                className="text-xs hover:border-b text-neutral-400 dark:text-neutral-600"
              >
                Contact Support
              </Link>
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
};
