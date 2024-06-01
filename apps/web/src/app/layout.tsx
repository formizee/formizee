import type {Metadata} from 'next';
import {Body} from '@/components';
import Loading from './loading';
import '@formizee/ui/globals.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Formizee | The Forms Backend platform',
  description: 'The Forms Backend platform, built for developers.',
  openGraph: {
    type: 'website',
    title: 'Formizee.',
    siteName: 'The open source Formspree alternative',
    url: 'https://formizee.com'
  },
  themeColor: '#000',
  metadataBase: new URL('https://formizee.com')
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <Body fallback={<Loading />}>{children}</Body>
    </html>
  );
}
