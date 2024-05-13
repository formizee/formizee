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

export const BaseBody = ({children}: Readonly<{children: React.ReactNode}>) => (
  <body className={className}>
    <Suspense fallback={<Loading />}>{children}</Suspense>
    <Toaster />
  </body>
);

export default BaseBody;
