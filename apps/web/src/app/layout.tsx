import {ThemeProvider} from '@/components/theme';
import {Toaster} from '@formizee/ui/toaster';
import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import '@formizee/ui/globals.css';
import {cn} from '@formizee/ui';
import './globals.css';

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: 'black'
};

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

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
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
          'min-h-screen bg-background font-sans antialiased',
          font.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
