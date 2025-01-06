import {WorkspaceMembersPageLoading} from '../../components/skeletons';
import {columns, MembersTable} from '../../components/tables/members';
import workspaceIcon from '@/../public/workspace.webp';
import {PageError} from '../../components/error';
import Transition from '@/components/transition';
import {api} from '@/trpc/client';
import Image from 'next/image';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceMembers = (props: Props) => {
  const {data, isLoading, error} = api.workspace.members.useQuery({
    slug: props.workspaceSlug
  });

  if (isLoading) {
    return <WorkspaceMembersPageLoading />;
  }

  if (error) {
    return <PageError />;
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
            <p className="font-secondary text-sm text-neutral-600 dark:text-neutral-400">
              This a a feature of the teams plan, we will add it in the future.
            </p>
          </div>
        </div>
      </section>
      <MembersTable columns={columns} data={members} />
    </Transition>
  );
};
