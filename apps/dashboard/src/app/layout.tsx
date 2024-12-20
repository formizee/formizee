import {Analytics} from '@vercel/analytics/react';
import {ThemeProvider} from '@/components/theme';
import {Toaster} from '@formizee/ui/toaster';
import {Inter} from 'next/font/google';
import type {Metadata} from 'next';
import '@formizee/ui/globals.css';
import {cn} from '@formizee/ui';
import Loading from './loading';
import {Suspense} from 'react';

import '@formizee/ui/globals.css';
import './globals.css';
import {TrpcProvider} from '@/components/trpc';

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Formizee | The Forms Backend platform',
  description: 'The Forms Backend platform, built for developers.',
  openGraph: {
    type: 'website',
    title: 'Formizee.',
    siteName: 'The open source Formspree alternative',
    url: 'https://formizee.com'
  },
  metadataBase: new URL('https://formizee.com')
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans antialiased',
          font.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <TrpcProvider>
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <Toaster />
          </TrpcProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
