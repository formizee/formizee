import Transition from '@/components/transition';
import cardIcon from '@/../public/card.webp';
import Image from 'next/image';
import {Button, Label, Separator} from '@formizee/ui';
import {CircleProgress} from '@/components/progress-circle';
import {PlusIcon} from '@formizee/ui/icons';

export const SettingsWorkspaceBilling = () => {
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
          <span>10 / 250</span>
          <CircleProgress percentage={7} />
        </Label>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Total Forms</Label>
        <Label className="flex flex-row gap-2 text-sm">
          <span>3 / 100</span>
          <CircleProgress percentage={3} />
        </Label>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Daily API Requests</Label>
        <Label className="flex flex-row gap-2 text-sm">
          <span>632 / 1,000</span>
          <CircleProgress percentage={63} />
        </Label>
      </div>
      <div className="flex justify-between items-end gap-2 mt-4">
        <Label className="text-sm">Members</Label>
        <Label className="flex flex-row gap-2 text-sm">
          <span>1 / 1</span>
          <CircleProgress percentage={100} />
        </Label>
      </div>
      <h1 className="font-semibold mt-8">Billing Plans</h1>
      <Separator className="mt-2 mb-4 w-full" />
      <div className="flex flex-row gap-2">
        <div className="flex flex-1 flex-col items-center gap-2 p-2 h-64 justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">Hobby</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              For personal projects
            </p>
          </div>
          <span className="font-semibold text-lg">$0 / month</span>
          <Separator />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-[1.4rem]">
            250 Submissions / mo
          </p>
          <Button className="w-full" disabled variant="outline">
            Current
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center dark:border-x-neutral-800 border-x px-4 gap-2 p-2 h-64 justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">Pro</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              For production projects
            </p>
          </div>
          <span className="font-semibold text-lg">$5 / month</span>
          <Separator />
          <div className="flex flex-col gap-2 items-center">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              1,000 Submissions / mo
            </p>
            <span className="flex flex-row gap-1 text-xs font-medium text-green-400">
              <PlusIcon /> More Features
            </span>
          </div>
          <Button className="w-full">Upgrade</Button>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 p-2 h-64 justify-between">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold">Teams</span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              For startups and teams
            </p>
          </div>
          <span className="font-semibold text-lg">$20 / month</span>
          <Separator />
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-[1.4rem]">
            50,000 Submissions / mo
          </p>
          <Button disabled variant="ghost">
            Coming Soon
          </Button>
        </div>
      </div>
    </Transition>
  );
};
