import {SettingsTabs, SettingsNavbar} from './_components';
import {Footer, Transition} from '@/components';
import {ChevronLeftIcon} from '@formizee/ui/icons';
import Link from 'next/link';

const Settings = async () => {
  return (
    <div className="flex flex-col h-screen">
      <SettingsNavbar />
      <Transition className="container px-8 flex flex-1 flex-col w-full pt-20 pb-10">
        <h1 className="bg-clip-text font-bold text-transparent mt-4 text-3xl bg-gradient-to-b from-slate-500 to-black dark:from-white dark:to-slate-400">
          Account Settings
        </h1>
        <Link
          href="/"
          className="max-w-44 group flex flex-row items-center text-neutral-600 font-semibold dark:text-neutral-400 mt-2 mb-8"
        >
          <ChevronLeftIcon className="h-5 w-0 transition-all group-hover:w-5 group-hover:pr-1" />
          Back To Workspace
        </Link>
        <SettingsTabs />
      </Transition>
      <Footer />
    </div>
  );
};

export default Settings;
