import {Footer, Navbar} from '@/components';
import {Toaster} from '@formizee/ui/toaster';

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans antialiased">
      <Navbar />
      {children}
      <Toaster />
      <Footer />
    </div>
  );
}
