import {Content, Navbar, Sidebar} from './components';

function DashboardLayout({
  children
}: Readonly<{children: React.ReactNode}>): JSX.Element {
  return (
    <main className="flex h-full flex-col items-center overflow-x-clip bg-black lg:justify-center">
      <Navbar />
      <div className="flex h-[calc(100vh-4.5rem)] w-full flex-row">
        <Sidebar />
        <Content>{children}</Content>
      </div>
    </main>
  );
}

export default DashboardLayout;
