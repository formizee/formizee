import {Sidebar, Navbar} from './_components';

const DashboardLayout = ({
  params,
  children
}: Readonly<{
  params: {workspaceSlug: string; endpointSlug: string};
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex w-full min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar
        workspaceSlug={params.workspaceSlug}
        endpointSlug={params.endpointSlug}
      />
      <Navbar />
      <div className="flex w-full flex-col p-8 justify-center items-center">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
