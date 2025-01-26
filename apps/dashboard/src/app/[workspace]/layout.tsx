import {SidebarProvider, SidebarTrigger} from '@formizee/ui/sidebar';
import {CommandPaletteProvider} from '@/components/command-palette';
import {SettingsProvider} from '@/components/settings';
import {AppSidebar} from '@/components/sidebar';
import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {auth} from '@/lib/auth';
import {env} from '@/lib/enviroment';

export default async function DashboardLayout({
  params,
  children
}: Readonly<{
  params: {workspace: string};
  children: React.ReactNode;
}>) {
  const cookiesState = cookies().get('sidebar:state')?.value;
  const defaultOpen =
    cookiesState === undefined ? true : cookiesState === 'true';
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SettingsProvider
        selfHosting={env().SELF_HOSTING}
        workspaceSlug={params.workspace}
        userId={session.user.id}
      >
        <CommandPaletteProvider workspaceSlug={params.workspace}>
          <AppSidebar {...params} />
          <main className="flex w-full h-dvh bg-white no-overflow dark:bg-black">
            <SidebarTrigger className="hidden sm:flex rounded-none size-6 px-1 h-dvh opacity-0 hover:opacity-100" />
            <div className="flex w-full flex-col p-2 sm:p-8 items-center overflow-auto  overflow-light-style dark:overflow-dark-style">
              {children}
            </div>
          </main>
        </CommandPaletteProvider>
      </SettingsProvider>
    </SidebarProvider>
  );
}
