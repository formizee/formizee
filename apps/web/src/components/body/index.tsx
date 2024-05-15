import {ThemeProvider} from '@/components';
import {Toaster} from '@/components/ui';
import {Inter} from 'next/font/google';
import Loading from '@/app/loading';
import {Suspense} from 'react';
import {cn} from '@/lib/ui';

const font = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const className = cn(
  'min-h-screen bg-background font-sans antialiased',
  font.variable
);

export function Body({children}: Readonly<{children: React.ReactNode}>) {
  return <body className={className}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ThemeProvider>
    <Toaster />
  </body>
}

export default Body;
