import {Analytics} from '@vercel/analytics/react';
import {ThemeProvider} from '@/components/theme';
import {Space_Grotesk} from 'next/font/google';
import {Inter} from 'next/font/google';
import type {Metadata} from 'next';
import '@formizee/ui/globals.css';
import {cn} from '@formizee/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Formizee | The Open-Source Forms Platform',
  description:
    'Formizee is the modern approach to create forms. Design, build and analytics all at an affordable price, all-in-one solution',
  openGraph: {
    type: 'website',
    title: 'Formizee.',
    siteName: 'The open source Formspree alternative',
    url: 'https://formizee.com'
  },
  metadataBase: new URL('https://formizee.com')
};

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const secondaryFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex flex-col min-h-screen bg-white dark:bg-black font-sans antialiased',
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
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
