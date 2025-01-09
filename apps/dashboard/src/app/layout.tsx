import {Inter, Space_Grotesk} from 'next/font/google';
import {Analytics} from '@vercel/analytics/react';
import {ThemeProvider} from '@/components/theme';
import {TrpcProvider} from '@/components/trpc';
import {Toaster} from '@formizee/ui/toaster';
import type {Metadata} from 'next';
import {cn} from '@formizee/ui';

import '@formizee/ui/globals.css';
import './globals.css';

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const secondaryFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Formizee is the modern approach to create forms. Design, build and analytics all at an affordable price, all-in-one solution',
  openGraph: {
    type: 'website',
    title: 'Formizee.',
    siteName: 'The open source Formspree alternative',
    url: 'https://dashboard.formizee.com'
  },
  metadataBase: new URL('https://dashboard.formizee.com')
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
          'min-h-screen bg-white dark:bg-black font-sans antialiased',
          secondaryFont.variable,
          font.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          enableColorScheme={true}
          disableTransitionOnChange
        >
          <TrpcProvider>
            {children}
            <Toaster />
          </TrpcProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
