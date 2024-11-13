import {ChevronLeftIcon} from '@formizee/ui/icons';
import {Footer, Transition} from '@/components';
import Link from 'next/link';

import {handleTrpcServerAction} from '@/trpc/utils';
import {redirect} from 'next/navigation';
import {api} from '@/trpc/server';
import {auth} from '@/lib/auth';
import GeneralSettings from './(content)/general';

const Settings = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await handleTrpcServerAction(
    api.user.get.query({id: session.user.id})
  );

  return (
    <div className="flex flex-col h-screen">
      <Transition className="container px-8 flex flex-1 flex-col w-full pt-24 pb-10">
        <div className="flex flex-row gap-4 items-center mt-2 mb-6">
          <div className="flex items-center justify-center size-12 rounded-md bg-neutral-600 dark:bg-neutral-400">
            <span className="fixed text-neutral-50 dark:text-neutral-950 font-semibold text-2xl">
              {user.name.split('')[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="bg-clip-text font-bold text-transparent text-xl bg-gradient-to-b from-slate-500 to-black dark:from-white dark:to-slate-400">
              {user.name}
            </h1>
            <Link
              href="/"
              className="max-w-44 group flex flex-row items-center text-amber-500 dark:text-amber-400 text-sm font-semibold"
            >
              <ChevronLeftIcon className="h-5 w-0 transition-all group-hover:w-5 group-hover:pr-1" />
              Back To Workspace
            </Link>
          </div>
        </div>
        <GeneralSettings user={user} />
      </Transition>
      <Footer />
    </div>
  );
};

export default Settings;
