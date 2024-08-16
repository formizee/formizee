import {Sidebar} from '@/components/sidebar';
import {Navbar} from '@/components/navbar';

const DashboardLayout = ({
  params,
  children
}: Readonly<{
  params: {workspaceSlug: string; endpointSlug: string};
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex w-full h-screen bg-neutral-50 no-overflow dark:bg-neutral-950">
      <Sidebar
        workspaceSlug={params.workspaceSlug}
        endpointSlug={params.endpointSlug}
      />
      <Navbar />
      <div className="flex w-full flex-col p-8 items-center overflow-auto  overflow-light-style dark:overflow-dark-style">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
