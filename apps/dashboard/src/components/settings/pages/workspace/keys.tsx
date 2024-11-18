import {WorkspaceKeysPageLoading} from '../../components/skeletons';
import {columns, KeysTable} from '../../components/tables/keys';
import {CreateKeyButton} from '../../components/dialogs/key';
import {PageError} from '../../components/error';
import Transition from '@/components/transition';
import keyIcon from '@/../public/key.webp';
import {api} from '@/trpc/client';
import Image from 'next/image';

interface Props {
  workspaceSlug: string;
}

export const SettingsWorkspaceKeys = (props: Props) => {
  const {data, isLoading, error} = api.key.list.useQuery({
    workspaceSlug: props.workspaceSlug
  });

  if (isLoading) {
    return <WorkspaceKeysPageLoading />;
  }

  if (!data || error) {
    return <PageError />;
  }

  const keys = data ?? [];

  return (
    <Transition className="flex flex-col w-full">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 mt-4">
        <div className="flex flex-row gap-4">
          <Image
            height={48}
            width={48}
            src={keyIcon}
            alt="Key Icon"
            className="z-[999] size-14 dark:border-2 rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col gap-1 items-start">
            <span className="font-medium">API Keys</span>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              These keys are used to interact with the Formizee API.
            </p>
          </div>
        </div>
        <CreateKeyButton {...props} />
      </section>
      <KeysTable columns={columns} data={keys} />
    </Transition>
  );
};
