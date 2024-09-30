import {columns, AuditTable} from '../_components/tables/audit';
import lockIcon from '@/../public/lock.webp';
import Transition from '@/components/transition';
import Image from 'next/image';

const Audit = async () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const logs: any[] = [];

  return (
    <Transition className="flex flex-col py-6 gap-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-8">
        <div className="flex flex-row gap-4">
          <Image
            height={56}
            width={56}
            src={lockIcon}
            alt="Lock Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Audit Logs</span>
            <p>Here are logged all the important actions on the workspace.</p>
          </div>
        </div>
      </section>
      <AuditTable columns={columns} data={logs} />
    </Transition>
  );
};

export default Audit;
