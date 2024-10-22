import {columns, MembersTable} from '../_components/tables/members';
import workspaceIcon from '@/../public/workspace.webp';
import {handleTrpcServerAction} from '@/trpc/utils';
import Transition from '@/components/transition';
import {api} from '@/trpc/server';
import Image from 'next/image';
import {AddMemberButton} from '../_components/dialogs/member';

interface Params {
  workspaceSlug: string;
}

const Members = async ({params}: {params: Params}) => {
  const members = await handleTrpcServerAction(
    api.workspace.getMembers.query({slug: params.workspaceSlug})
  );

  return (
    <Transition className="flex flex-col py-6 gap-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-8">
        <div className="flex flex-row gap-4">
          <Image
            height={56}
            width={56}
            src={workspaceIcon}
            alt="Workspace Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Members</span>
            <p>
              This a a feature of the paid plans, if you want to use{' '}
              <b>members</b> please upgrade.
            </p>
          </div>
        </div>
        <AddMemberButton />
      </section>
      <MembersTable columns={columns} data={members} />
    </Transition>
  );
};

export default Members;
