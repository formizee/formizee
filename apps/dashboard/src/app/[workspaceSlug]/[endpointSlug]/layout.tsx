import {Sidebar} from '@/components/sidebar';
import {Navbar} from '@/components/navbar';
import {redirect} from 'next/navigation';
import {auth} from '@/lib/auth';

const DashboardLayout = async ({
  params,
  children
}: Readonly<{
  params: {workspaceSlug: string; endpointSlug: string};
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <main className="flex w-full h-screen bg-neutral-50 no-overflow dark:bg-neutral-950">
      <Sidebar
        workspaceSlug={params.workspaceSlug}
        endpointSlug={params.endpointSlug}
      />
      <Navbar userId={session.user.id} />
      <div className="flex w-full flex-col p-8 items-center overflow-auto  overflow-light-style dark:overflow-dark-style">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
