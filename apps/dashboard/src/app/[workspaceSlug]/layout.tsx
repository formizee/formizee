import {cookies} from 'next/headers';

import {SidebarProvider, SidebarTrigger} from '@formizee/ui/sidebar';
import {AppSidebar} from '@/components/sidebar';
import {auth} from '@/lib/auth';
import {redirect} from 'next/navigation';

export default async function DashboardLayout({
  params,
  children
}: Readonly<{
  params: {workspaceSlug: string};
  children: React.ReactNode;
}>) {
  const defaultOpen = cookies().get('sidebar:state')?.value === 'true';
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar {...params} />
      <main className="flex w-full h-screen bg-neutral-50 no-overflow dark:bg-neutral-950">
        <SidebarTrigger className="rounded-none size-6 px-1 h-screen opacity-0 hover:opacity-100" />
        <div className="flex w-full flex-col p-8 items-center overflow-auto  overflow-light-style dark:overflow-dark-style">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
