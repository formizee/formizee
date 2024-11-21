import {WorkspacePlansPageLoading} from '../../components/skeletons';
import {PlanWidget} from '../../components/billing/plan';
import Transition from '@/components/transition';
import upgradeIcon from '@/../public/upgrade.webp';
import {api} from '@/trpc/client';
import Image from 'next/image';
import {PageError} from '../../components/error';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspacePlans = (props: Props) => {
  const {data, isLoading, error} = api.workspace.get.useQuery({
    slug: props.workspaceSlug
  });

  if (isLoading) {
    return <WorkspacePlansPageLoading />;
  }

  if (error) {
    return <PageError />;
  }

  const workspace = data;

  return (
    <Transition className="flex flex-col w-full mt-4">
      <div className="flex flex-row gap-4">
        <Image
          height={48}
          width={48}
          src={upgradeIcon}
          alt="Upgrade Icon"
          className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
        />
        <div className="flex flex-col gap-1 items-start">
          <span className="font-medium">Formizee Plans</span>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            What you want, you get it. Priceless options for all sizes
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-8 h-full">
        <PlanWidget
          workspacePlan={workspace.plan}
          workspaceId={workspace.id}
          plan="hobby"
        />
        <PlanWidget
          workspacePlan={workspace.plan}
          workspaceId={workspace.id}
          plan="pro"
        />
      </div>
    </Transition>
  );
};
