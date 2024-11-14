import {columns, AuditTable} from '../../components/tables/audit';
import Transition from '@/components/transition';
import lockIcon from '@/../public/lock.webp';
import Image from 'next/image';
import {Button} from '@formizee/ui';
import {DocumentIcon} from '@formizee/ui/icons';

export const SettingsWorkspaceAudit = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const logs: any[] = [];

  return (
    <Transition className="flex flex-col w-full">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
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
              Here are logged all the important actions on the workspace.
            </p>
          </div>
        </div>
        <Button variant="outline">
          Export <DocumentIcon />
        </Button>
      </section>
      <AuditTable columns={columns} data={logs} />
    </Transition>
  );
};
