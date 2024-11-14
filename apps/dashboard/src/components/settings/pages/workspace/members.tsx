import {columns, MembersTable} from '../../components/tables/members';
import {AddMemberButton} from '../../components/dialogs/member';
import workspaceIcon from '@/../public/workspace.webp';
import Transition from '@/components/transition';
import {api} from '@/trpc/client';
import Image from 'next/image';
import {Skeleton} from '@formizee/ui';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceMembers = (props: Props) => {
  const {data, isLoading} = api.workspace.getMembers.useQuery({
    slug: props.workspaceSlug
  });

  if (isLoading) {
    return (
      <Transition className="flex flex-col w-full">
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
          <div className="flex flex-row gap-4">
            <Skeleton className="size-14 rounded-xl" />
            <div className="flex flex-col gap-2 items-start">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <Skeleton className="w-36 h-10" />
        </section>
        <Skeleton className="mt-4 w-full h-10" />
        <Skeleton className="mt-4 w-full h-32" />
      </Transition>
    );
  }

  const members = data ?? [];

  return (
    <Transition className="flex flex-col w-full">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
        <div className="flex flex-row gap-4">
          <Image
            height={48}
            width={48}
            src={workspaceIcon}
            alt="Workspace Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col gap-1 items-start">
            <span className="font-medium">Members</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This a a feature of the paid plans, upgrade in order to use it.
            </p>
          </div>
        </div>
        <AddMemberButton />
      </section>
      <MembersTable columns={columns} data={members} />
    </Transition>
  );
};
