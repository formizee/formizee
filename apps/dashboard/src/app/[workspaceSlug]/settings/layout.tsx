import {Footer, Transition} from '@/components';
import Tabs from './_components/tabs';

interface Params {
  workspaceSlug: string;
}

const Settings = async ({
  children,
  params
}: {children: React.ReactNode; params: Params}) => {
  return (
    <div className="flex flex-col h-screen">
      <Transition className="container px-8 flex flex-1 flex-col w-full pt-20 pb-10">
        <h1 className="bg-clip-text font-bold text-transparent mt-4 text-3xl bg-gradient-to-b from-slate-500 to-black dark:from-white dark:to-slate-400">
          Workspace Settings
        </h1>
        <Tabs {...params} />
        {children}
      </Transition>
      <Footer />
    </div>
  );
};

export default Settings;
