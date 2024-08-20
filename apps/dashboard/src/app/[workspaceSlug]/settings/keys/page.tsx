import {columns, KeysTable} from '../_components/tables/keys';
import {handleTrpcServerAction} from '@/trpc/utils';
import {BookIcon} from '@formizee/ui/icons';
import keyIcon from '@/../public/key.webp';
import {Transition} from '@/components';
import {Button} from '@formizee/ui';
import {api} from '@/trpc/server';
import Image from 'next/image';
import Link from 'next/link';
import {CreateKeyButton} from '../_components/new/key';

interface Params {
  workspaceSlug: string;
}

const Keys = async ({params}: {params: Params}) => {
  const keys = await handleTrpcServerAction(
    api.key.list.query({workspaceSlug: params.workspaceSlug})
  );

  return (
    <Transition>
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 my-8">
        <div className="flex flex-row gap-4">
          <Image
            height={56}
            width={56}
            src={keyIcon}
            alt="Key Icon"
            className="z-[999] size-14 dark:rounded-[0.65rem] rounded-xl border-4 dark:border dark:border-neutral-600 border-neutral-300 shadow-md shadow-neutral-950"
          />
          <div className="flex flex-col items-start">
            <span className="font-bold text-xl">Root Keys</span>
            <p>These keys are used to interact with the Formizee API.</p>
          </div>
        </div>
        <div className="flex flex-row-reverse sm:flex-row gap-4">
          <Button variant="outline" asChild>
            <Link
              href="https://docs.formizee.com/api-references/authentication"
              target="_blank"
            >
              See The Docs
              <BookIcon />
            </Link>
          </Button>
          <CreateKeyButton {...params} />
        </div>
      </section>
      <KeysTable columns={columns} data={keys} />
    </Transition>
  );
};

export default Keys;
