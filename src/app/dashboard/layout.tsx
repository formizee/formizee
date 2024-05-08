import {Navbar, Sidebar, Content} from './components';

const DashboardLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
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