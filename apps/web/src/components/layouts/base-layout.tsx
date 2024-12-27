import {Toaster} from '@formizee/ui/toaster';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export function BaseLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
      <Toaster />
      <Footer />
    </div>
  );
}
