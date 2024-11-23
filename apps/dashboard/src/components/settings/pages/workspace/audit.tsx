import {WorkspaceAuditPageLoading} from '../../components/skeletons';
import {columns, AuditTable} from '../../components/tables/audit';
import {PageError} from '../../components/error';
import Transition from '@/components/transition';
import lockIcon from '@/../public/lock.webp';
import {api} from '@/trpc/client';
import Image from 'next/image';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceAudit = (props: Props) => {
  const {data, isLoading, error} = api.audit.list.useQuery({
    workspaceSlug: props.workspaceSlug
  });

  if (isLoading) {
    return <WorkspaceAuditPageLoading />;
  }

  if (error) {
    return <PageError />;
  }

  const logs = data ?? [];

  return (
    <Transition className="flex flex-col w-full">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 my-4">
        <div className="flex flex-row gap-4">
          <Image
            height={48}
            width={48}
            src={lockIcon}
            alt="Lock Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col gap-1 items-start">
            <span className="font-medium">Audit Logs</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Here are logged all the important actions of the last 7 days.
            </p>
          </div>
        </div>
      </section>
      <AuditTable columns={columns} data={logs} />
    </Transition>
  );
};
