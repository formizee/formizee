import Transition from '@/components/transition';
import cardIcon from '@/../public/card.webp';
import Image from 'next/image';
import {Button, Label, Separator} from '@formizee/ui';
import {CircleProgress} from '@/components/progress-circle';
import {PlusIcon} from '@formizee/ui/icons';
import {getLimits, planConfig} from '@formizee/plans';
import {api} from '@/trpc/client';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceBilling = (props: Props) => {
  const workspace = api.workspace.getBySlug.useQuery({
    slug: props.workspaceSlug
  }).data;
  const usage = api.workspace.getLimits.useQuery({
    slug: props.workspaceSlug
  }).data;

  if (!workspace || !usage) {
    return;
  }

  const currentPlanLimits = getLimits(workspace.plan);

  return (
    <Transition className="flex flex-col w-full mt-4">
      <div className="flex flex-row gap-4">
        <Image
          height={48}
          width={48}
          src={cardIcon}
          alt="Credit Card Icon"
          className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
        />
        <div className="flex flex-col gap-1 items-start">
          <span className="font-medium">Billing</span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            The payment settings of the workspace
          </p>
        </div>
      </div>
      <h1 className="font-semibold mt-8">Current Usage</h1>
      <Separator className="mt-2 w-full" />
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Monthly Submissions</Label>
        <Label className="flex flex-row gap-2 text-sm">
          <span>
            {usage.submissions} /{' '}
            {currentPlanLimits.submissions.toLocaleString()}
          </span>
          <CircleProgress
            percentage={
              (usage.submissions / currentPlanLimits.submissions) * 100
            }
          />
        </Label>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Total Forms</Label>
        <Label className="flex flex-row gap-2 text-sm">
          {currentPlanLimits.endpoints === 'unlimited' ? (
            <span>Unlimited</span>
          ) : (
            <>
              <span>
                {usage.endpoints} /{' '}
                {currentPlanLimits.endpoints.toLocaleString()}
              </span>
              <CircleProgress
                percentage={
                  (usage.endpoints / currentPlanLimits.endpoints) * 100
                }
              />
            </>
          )}
        </Label>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Total Keys</Label>
        <Label className="flex flex-row gap-2 text-sm">
          {currentPlanLimits.keys === 'unlimited' ? (
            <span>Unlimited</span>
          ) : (
            <>
              <span>
                {usage.keys} / {currentPlanLimits.keys.toLocaleString()}
              </span>
              <CircleProgress
                percentage={(usage.keys / currentPlanLimits.keys) * 100}
              />
            </>
          )}
        </Label>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Members</Label>
        <Label className="flex flex-row gap-2 text-sm">
          {currentPlanLimits.members === 'unlimited' ? (
            <span>Unlimited</span>
          ) : (
            <>
              <span>
                {usage.members} / {currentPlanLimits.members.toLocaleString()}
              </span>
              <CircleProgress
                percentage={(usage.members / currentPlanLimits.members) * 100}
              />
            </>
          )}
        </Label>
      </div>
      <h1 className="font-semibold mt-8">Billing Plans</h1>
      <Separator className="mt-2 mb-4 w-full" />
      <div className="flex flex-row gap-2">
        <div className="flex flex-1 flex-col items-center gap-2 p-2 h-64 justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">{planConfig.hobby.title}</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {planConfig.hobby.description}
            </p>
          </div>
          <span className="font-semibold text-lg">$0 / month</span>
          <Separator />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-[1.5rem]">
            {planConfig.hobby.limits.submissions.toLocaleString()} Submissions /
            mo
          </p>
          <Button
            className="w-full"
            disabled={workspace.plan === 'hobby'}
            variant="outline"
          >
            {workspace.plan === 'hobby' ? 'Current' : 'Change Plan'}
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center dark:border-x-neutral-800 border-x px-4 gap-2 p-2 h-64 justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">{planConfig.pro.title}</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {planConfig.pro.description}
            </p>
          </div>
          <span className="font-semibold text-lg">$5 / month</span>
          <Separator />
          <div className="flex flex-col gap-2 items-center">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {planConfig.pro.limits.submissions.toLocaleString()} Submissions /
              mo
            </p>
            <span className="flex flex-row gap-1 text-xs font-medium text-green-600">
              <PlusIcon /> More Features
            </span>
          </div>
          <Button disabled={workspace.plan === 'pro'} className="w-full">
            {workspace.plan === 'pro' ? 'Current' : 'Upgrade'}
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 p-2 h-64 justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">{planConfig.teams.title}</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {planConfig.teams.description}
            </p>
          </div>
          <span className="font-semibold text-lg">$20 / month</span>
          <Separator />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-[1.5rem]">
            {planConfig.teams.limits.submissions.toLocaleString()} Submissions /
            mo
          </p>
          <Button disabled variant="ghost">
            Coming Soon
          </Button>
        </div>
      </div>
    </Transition>
  );
};
