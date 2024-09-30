import {columns, KeysTable} from '../_components/tables/keys';
import {CreateKeyButton} from '../_components/dialogs/key';
import {handleTrpcServerAction} from '@/trpc/utils';
import keyIcon from '@/../public/key.webp';
import {Transition} from '@/components';
import {api} from '@/trpc/server';
import Image from 'next/image';

interface Params {
  workspaceSlug: string;
}

const Keys = async ({params}: {params: Params}) => {
  const keys = await handleTrpcServerAction(
    api.key.list.query({workspaceSlug: params.workspaceSlug})
  );

  return (
    <Transition className="flex flex-col py-6 gap-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-8">
        <div className="flex flex-row gap-4">
          <Image
            height={56}
            width={56}
            src={keyIcon}
            alt="Key Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Root Keys</span>
            <p>These keys are used to interact with the Formizee API.</p>
          </div>
        </div>
        <CreateKeyButton {...params} />
      </section>
      <KeysTable columns={columns} data={keys} />
    </Transition>
  );
};

export default Keys;
