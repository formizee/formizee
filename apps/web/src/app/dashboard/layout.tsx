import {createServerClient} from '@/lib/supabase/server';
import {Navbar, Sidebar, Content} from './components';
import {redirect} from 'next/navigation';

const DashboardLayout = async ({
  children
}: Readonly<{children: React.ReactNode}>) => {
  const supabase = createServerClient();

  const {data, error} = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <main className="flex h-full flex-col items-center overflow-x-clip bg-black lg:justify-center">
      <Navbar />
      <div className="flex h-[calc(100vh-3.5rem)] w-full flex-row">
        <Sidebar />
        <Content>{children}</Content>
      </div>
    </main>
  );
};

export default DashboardLayout;
